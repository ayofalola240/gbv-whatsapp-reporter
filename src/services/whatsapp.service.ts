import axios from 'axios';
// import { IncidentReport } from '../../models/incidentReport.model'; // Assuming you have a session/temp storage

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const FCTA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID; // The Bot's WhatsApp Phone Number ID

// Temporary in-memory store for conversation state. In production, use Redis or a DB.
interface UserSession {
  currentStep: string;
  language?: 'English' | 'Yoruba' | 'Igbo' | 'Hausa';
  reportData: Partial<any>; // Store partial report data
  lastMessageId?: string;
}
const userSessions: Record<string, UserSession> = {};

// --- WhatsApp API Client ---
const whatsappAPI = axios.create({
  baseURL: `https://graph.facebook.com/v19.0/${FCTA_PHONE_NUMBER_ID}`, // Use your API version
  headers: {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const sendWhatsAppMessage = async (to: string, message: any) => {
  try {
    const response = await whatsappAPI.post('/messages', {
      messaging_product: 'whatsapp',
      to: to,
      ...message // This could be a text message, interactive message, etc.
    });
    console.log('WhatsApp message sent:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
};

export const sendTextMessage = async (to: string, text: string) => {
  return sendWhatsAppMessage(to, { type: 'text', text: { body: text } });
};

export const sendInteractiveMessage = async (to: string, interactive: any) => {
  return sendWhatsAppMessage(to, { type: 'interactive', interactive });
};

// --- Conversation Logic ---
export const processMessage = async (from: string, message: any, botPhoneNumberId: string) => {
  let session = userSessions[from];
  if (!session) {
    session = { currentStep: 'start', reportData: {} };
    userSessions[from] = session;
  }

  // Prevent processing echoes of bot's own messages if not handled carefully
  if (message.from === botPhoneNumberId) {
    // console.log("Ignoring own message echo.");
    // return;
  }

  // Basic message type handling [cite: 8, 70]
  let userResponseText = '';
  if (message.type === 'text') {
    userResponseText = message.text.body;
  } else if (message.type === 'interactive') {
    if (message.interactive.type === 'button_reply') {
      userResponseText = message.interactive.button_reply.id; // Use ID for consistent processing
    } else if (message.interactive.type === 'list_reply') {
      userResponseText = message.interactive.list_reply.id;
    }
  } else if (message.type === 'image' || message.type === 'audio' || message.type === 'video') {
    // [cite: 8, 70, 109]
    // Handle media messages: Download media using message.image.id or message.audio.id etc.
    // The Meta API provides an endpoint to download media.
    // Store it and link to the report (MediaFile model)
    // For now, acknowledge receipt or handle based on current step
    if (session.currentStep === 'collect_evidence_prompt') {
      session.reportData.mediaAttached = true; // Mark that media was sent
      // You would add logic here to call Meta API to get media URL and download it
      // e.g., GET /v19.0/{media-id} then GET the URL from response.
      await sendTextMessage(from, "Thank you for the media. What's next?");
      // Potentially move to next step or re-prompt for description if media is part of it.
      session.currentStep = 'ask_help_or_service'; // Example next step
      await promptHelpOrService(from, session.language || 'English');
      return;
    } else {
      await sendTextMessage(from, "I've received a media file. If this is for your report, please send it when I ask for evidence.");
      return;
    }
  }

  console.log(`Processing step: ${session.currentStep} for user ${from} with response: ${userResponseText}`);

  switch (session.currentStep) {
    case 'start':
      await sendLanguageSelection(from);
      session.currentStep = 'select_language';
      break;

    case 'select_language':
      if (['english', 'yoruba', 'igbo', 'hausa'].includes(userResponseText.toLowerCase())) {
        session.language = userResponseText.toLowerCase() as UserSession['language'];
        // Store language. All subsequent messages should be in this language.
        await sendTextMessage(from, `Language set to ${session.language}.`); // Translate this
        await promptAnonymity(from, session.language);
        session.currentStep = 'select_anonymity';
      } else {
        await sendLanguageSelection(from); // Re-prompt
      }
      break;

    case 'select_anonymity':
      if (userResponseText.toLowerCase() === 'share_details') {
        session.reportData.isAnonymous = false;
        await sendTextMessage(from, 'Please enter your name (or nickname).');
        session.currentStep = 'enter_name';
      } else if (userResponseText.toLowerCase() === 'remain_anonymous') {
        session.reportData.isAnonymous = true;
        await sendTextMessage(from, "That's okay. You can report anonymously.");
        await promptIncidentOrHelp(from, session.language);
        session.currentStep = 'incident_or_help';
      } else {
        await promptAnonymity(from, session.language);
      }
      break;

    case 'enter_name':
      session.reportData.reporterName = userResponseText;
      await sendTextMessage(from, "Can we have a phone number we can reach you on (optional)? Type 'skip' if you prefer not to.");
      session.currentStep = 'enter_phone';
      break;

    case 'enter_phone':
      if (userResponseText.toLowerCase() !== 'skip') {
        session.reportData.reporterPhone = userResponseText; // Basic validation should be added
      }
      await promptIncidentOrHelp(from, session.language);
      session.currentStep = 'incident_or_help';
      break;

    case 'incident_or_help':
      if (userResponseText.toLowerCase() === 'report_incident') {
        await sendTextMessage(from, "When did this incident happen? (e.g., YYYY-MM-DD or 'yesterday')");
        session.currentStep = 'collect_date';
      } else if (userResponseText.toLowerCase() === 'request_help') {
        // ... handle help request flow ...
        await promptHelpOrService(from, session.language, true); // isDirectRequest = true
        session.currentStep = 'select_services_direct';
      } else if (userResponseText.toLowerCase() === 'check_status') {
        await sendTextMessage(from, 'Please provide your Report Reference ID.');
        session.currentStep = 'enter_reference_id_for_status';
      } else {
        await promptIncidentOrHelp(from, session.language);
      }
      break;

    // --- Incident Data Collection Steps ---
    case 'collect_date':
      // TODO: Validate date format
      session.reportData.incidentDate = userResponseText; // Needs parsing and validation
      await promptIncidentTime(from, session.language);
      session.currentStep = 'collect_time';
      break;

    case 'collect_time':
      session.reportData.incidentTime = userResponseText; // e.g., 'Morning', '10:30 AM'
      await sendTextMessage(from, 'Please describe where it happened (e.g., state, LGA, street, or any known location).');
      session.currentStep = 'collect_location_description';
      break;

    case 'collect_location_description':
      session.reportData.locationText = userResponseText;
      await promptExactLocationType(from, session.language);
      session.currentStep = 'collect_exact_location_type';
      break;

    case 'collect_exact_location_type':
      session.reportData.exactLocationType = userResponseText; // E.g., "Home", "School" or if "Other", the description.
      if (userResponseText.toLowerCase() === 'other_location') {
        await sendTextMessage(from, "Please describe the 'other' location.");
        session.currentStep = 'collect_other_location_detail';
      } else {
        await promptViolenceType(from, session.language);
        session.currentStep = 'collect_violence_type';
      }
      break;

    case 'collect_other_location_detail':
      session.reportData.exactLocationType = `Other: ${userResponseText}`;
      await promptViolenceType(from, session.language);
      session.currentStep = 'collect_violence_type';
      break;

    case 'collect_violence_type':
      // User might select multiple if using a multi-select list, or one by one if buttons.
      // Assuming buttons for simplicity here.
      session.reportData.violenceType = userResponseText; // e.g., "Sexual Assault"
      if (userResponseText.toLowerCase() === 'other_violence') {
        await sendTextMessage(from, "Please specify the 'other' type of violence.");
        session.currentStep = 'collect_other_violence_detail';
      } else {
        await promptPerpetratorKnown(from, session.language);
        session.currentStep = 'collect_perpetrator_known';
      }
      break;

    case 'collect_other_violence_detail':
      session.reportData.violenceType = `Other: ${userResponseText}`;
      await promptPerpetratorKnown(from, session.language);
      session.currentStep = 'collect_perpetrator_known';
      break;

    case 'collect_perpetrator_known':
      if (userResponseText.toLowerCase() === 'yes_know_perpetrator') {
        await promptPerpetratorRelationship(from, session.language);
        session.currentStep = 'collect_perpetrator_relationship';
      } else {
        // No or skip
        session.reportData.perpetratorKnown = false;
        await sendTextMessage(from, 'Please tell us briefly what happened.');
        session.currentStep = 'collect_description';
      }
      break;

    case 'collect_perpetrator_relationship':
      session.reportData.perpetratorRelationship = userResponseText;
      await sendTextMessage(from, 'How many perpetrators were involved?');
      session.currentStep = 'collect_perpetrator_count';
      break;

    case 'collect_perpetrator_count':
      session.reportData.perpetratorCount = userResponseText; // Should be validated as a number
      await sendTextMessage(from, 'Please tell us briefly what happened.');
      session.currentStep = 'collect_description';
      break;

    case 'collect_description':
      session.reportData.description = userResponseText;
      await promptMediaUpload(from, session.language);
      session.currentStep = 'collect_evidence_prompt';
      break;

    case 'collect_evidence_prompt':
      if (userResponseText.toLowerCase() === 'send_now') {
        await sendTextMessage(from, 'Okay, please upload your photo, video, or voice note now.');
        // The next message from the user, if media, will be handled by the media type check at the beginning.
        // No specific 'currentStep' change here, wait for media or another text.
      } else {
        // Skip
        await promptHelpOrService(from, session.language);
        session.currentStep = 'ask_help_or_service';
      }
      break;

    case 'ask_help_or_service':
      if (userResponseText.toLowerCase() === 'yes_need_help') {
        await promptServiceSelection(from, session.language);
        session.currentStep = 'collect_services';
      } else {
        // No help needed or skipped
        await promptConsent(from, session.language);
        session.currentStep = 'collect_consent';
      }
      break;

    case 'collect_services':
      // This could be a multi-select. For simplicity, assume one service or 'other'.
      session.reportData.servicesRequested = [userResponseText]; // Needs better handling for multi-select
      if (userResponseText.toLowerCase() === 'other_service') {
        await sendTextMessage(from, "Please specify the 'other' help you need.");
        session.currentStep = 'collect_other_service_detail';
      } else {
        await promptConsent(from, session.language);
        session.currentStep = 'collect_consent';
      }
      break;

    case 'collect_other_service_detail':
      session.reportData.servicesRequested = [`Other: ${userResponseText}`];
      await promptConsent(from, session.language);
      session.currentStep = 'collect_consent';
      break;

    // This case handles direct requests for help without filing an incident report first.
    case 'select_services_direct':
      session.reportData.servicesRequested = [userResponseText];
      session.reportData.isDirectServiceRequest = true; // Flag this
      // Could ask for brief context if needed, or go straight to consent for sharing details for service provision
      await sendTextMessage(
        from,
        'Thank you. To connect you with services, we need your consent to share your request and contact (if provided) with authorized support services.'
      );
      await promptConsent(from, session.language, true); // isServiceRequest=true
      session.currentStep = 'collect_consent_direct_service';
      break;

    case 'collect_consent': // Consent for incident report
    case 'collect_consent_direct_service': // Consent for direct service request
      if (userResponseText.toLowerCase() === 'yes_consent') {
        session.reportData.consentGiven = true;
        // TODO: Finalize and save the IncidentReport
        // This is where you would call a function to:
        // 1. Parse all session.reportData into the IIncidentReport structure
        // 2. Validate all fields
        // 3. Save to MongoDB
        // 4. Trigger escalation logic
        // 5. Trigger PDF generation and email
        // For now, just confirm.
        const refId = `GBV-${Math.random().toString(36).substr(2, 5).toUpperCase()}`; // Dummy ref ID
        session.reportData.referenceId = refId;
        await sendTextMessage(from, `Thank you. Your report has been successfully submitted. Your Reference ID is: ${refId}.`);
        if (session.currentStep === 'collect_consent') {
          await sendTextMessage(from, 'We will escalate this to the appropriate agency, and someone may contact you shortly.');
        } else {
          // direct service
          await sendTextMessage(from, 'We will connect you with the appropriate service provider shortly.');
        }
        await promptFollowUpUpdates(from, session.language);
        session.currentStep = 'ask_follow_up';
        // Clear session or mark as completed
        // delete userSessions[from];
      } else {
        // No consent [cite: 14]
        session.reportData.consentGiven = false;
        await sendTextMessage(from, 'We understand. Without consent, we cannot submit the report. You can come back anytime.');
        delete userSessions[from]; // Abort report
      }
      break;

    case 'ask_follow_up':
      // Handle 'yes' or 'no' for follow-up updates
      if (userResponseText.toLowerCase() === 'yes_follow_up') {
        await sendTextMessage(from, 'Okay, we will send you periodic updates.');
      } else {
        await sendTextMessage(from, 'Alright. You can check the status anytime using your reference ID.');
      }
      delete userSessions[from]; // End of flow
      break;

    default:
      await sendTextMessage(from, "Sorry, I didn't understand that. Let's start over.");
      await sendLanguageSelection(from);
      session.currentStep = 'select_language';
      break;
  }
  userSessions[from] = session; // Save session state
};

// --- Prompt Functions (using interactive messages) ---
// These should be localized based on session.language

const getLocalizedText = (key: string, lang: UserSession['language'] = 'English', ...args: any[]): string => {
  // Simple example, replace with a proper i18n library
  const SAMPLES: Record<string, Record<string, string>> = {
    welcome_message: { English: 'Welcome to the FCTA GBV Reporting Center. How would you like to continue?\nPlease select your language:' },
    anonymity_prompt: { English: 'Would you like to remain anonymous or share your details with us?' },
    incident_or_help_prompt: { English: 'Would you like to:' },
    incident_time_prompt: { English: 'What time of day did it happen?' },
    exact_location_prompt: { English: 'Where exactly did it happen?' },
    violence_type_prompt: { English: 'What type of violence was experienced? (Select one for now, you can describe more later)' },
    perpetrator_known_prompt: { English: 'Do you know the perpetrator(s)?' },
    perpetrator_relationship_prompt: { English: 'What is your relationship to them?' },
    media_upload_prompt: { English: 'You may also upload a photo, video, or voice note if it helps explain or show evidence.' },
    help_or_service_prompt: { English: 'Would you like support or help for this incident?' },
    select_services_prompt: { English: 'Please select the help you need (you can choose more than one):' },
    consent_prompt: {
      English:
        "Do you give us consent to safely share this report with authorized support services (like FCTA Women's Affairs, NAPTIP, NSCDC, shelters)?"
    },
    consent_prompt_direct_service: {
      English:
        'Do you give us consent to share your request and contact details (if provided) with authorized support services for them to assist you?'
    },
    follow_up_prompt: { English: 'Would you like to receive periodic updates on your report?' }
  };
  let text = SAMPLES[key]?.[lang || 'English'] || `Missing translation for: ${key}`;
  args.forEach((arg, i) => (text = text.replace(`{${i}}`, arg)));
  return text;
};

const sendLanguageSelection = async (to: string) => {
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText('welcome_message') },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'english', title: 'English' } },
        { type: 'reply', reply: { id: 'yoruba', title: 'Yoruba' } },
        { type: 'reply', reply: { id: 'igbo', title: 'Igbo' } },
        { type: 'reply', reply: { id: 'hausa', title: 'Hausa' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptAnonymity = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText('anonymity_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'remain_anonymous', title: 'Remain Anonymous' } },
        { type: 'reply', reply: { id: 'share_details', title: 'Share My Details' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptIncidentOrHelp = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText('incident_or_help_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'report_incident', title: 'Report an Incident' } },
        { type: 'reply', reply: { id: 'request_help', title: 'Request Help or Service' } },
        { type: 'reply', reply: { id: 'check_status', title: 'Check Status of a Report' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptIncidentTime = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText('incident_time_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'Morning', title: 'Morning' } },
        { type: 'reply', reply: { id: 'Afternoon', title: 'Afternoon' } },
        { type: 'reply', reply: { id: 'Evening', title: 'Evening' } },
        { type: 'reply', reply: { id: 'Night', title: 'Night' } },
        { type: 'reply', reply: { id: 'Not_Sure_Time', title: 'Not Sure' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptExactLocationType = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'list', // Changed to list for more options
    body: { text: getLocalizedText('exact_location_prompt', lang) },
    action: {
      button: 'Select Location Type',
      sections: [
        {
          title: 'Location Types',
          rows: [
            { id: 'Home', title: 'Home' },
            { id: 'School', title: 'School' },
            { id: 'Workplace', title: 'Workplace' },
            { id: 'Street_or_Road', title: 'Street or Road' },
            { id: 'Perpetrators_house', title: "Perpetrator's house" },
            { id: 'other_location', title: 'Other (Please describe)' }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptViolenceType = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'list',
    body: { text: getLocalizedText('violence_type_prompt', lang) },
    action: {
      button: 'Select Violence Type',
      sections: [
        {
          title: 'Types of Violence',
          rows: [
            { id: 'Sexual_Assault', title: 'Sexual Assault' },
            { id: 'Rape', title: 'Rape' },
            { id: 'Defilement', title: 'Defilement' },
            { id: 'Physical_Assault', title: 'Physical Assault' },
            { id: 'Psychological_Abuse', title: 'Psychological Abuse' },
            { id: 'Forced_Marriage', title: 'Forced Marriage' },
            { id: 'Online_Harassment', title: 'Online Harassment' },
            { id: 'other_violence', title: 'Other (Please specify)' }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptPerpetratorKnown = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText('perpetrator_known_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_know_perpetrator', title: 'Yes' } },
        { type: 'reply', reply: { id: 'no_know_perpetrator', title: 'No' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptPerpetratorRelationship = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'list',
    body: { text: getLocalizedText('perpetrator_relationship_prompt', lang) },
    action: {
      button: 'Select Relationship',
      sections: [
        {
          title: 'Relationship to Perpetrator',
          rows: [
            { id: 'Spouse_Partner', title: 'Spouse/Partner' },
            { id: 'Relative', title: 'Relative' },
            { id: 'Teacher', title: 'Teacher' },
            { id: 'Police_Authority', title: 'Police/Authority' },
            { id: 'Stranger', title: 'Stranger' },
            { id: 'Other_Relationship', title: 'Other' }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptMediaUpload = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText('media_upload_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'send_now', title: 'Send Now' } },
        { type: 'reply', reply: { id: 'skip_media', title: 'Skip' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptHelpOrService = async (to: string, lang: UserSession['language'], isDirectRequest = false) => {
  const text = isDirectRequest ? getLocalizedText('select_services_prompt', lang) : getLocalizedText('help_or_service_prompt', lang);
  const interactive = {
    type: 'button',
    body: { text },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_need_help', title: 'Yes' } },
        { type: 'reply', reply: { id: 'no_need_help', title: 'No' } }
      ]
    }
  };
  // If it's a direct request for service, the "yes" means they want to select services.
  // If it's after an incident report, "yes" also means they want to select services.
  // The 'no_need_help' button ID can be used to skip to consent if it's part of incident reporting.
  if (isDirectRequest) {
    // Directly ask for service types if they say yes to "Request Help or Service" earlier
    await promptServiceSelection(to, lang);
  } else {
    await sendInteractiveMessage(to, interactive);
  }
};

const promptServiceSelection = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'list', // Good for multiple selections, though WhatsApp buttons only allow one reply at a time.
    // For true multi-select, you might need to ask multiple times or use a checklist approach.
    body: { text: getLocalizedText('select_services_prompt', lang) },
    action: {
      button: 'Select Service',
      sections: [
        {
          title: 'Available Support',
          rows: [
            { id: 'Police_Security', title: 'Police/Security' },
            { id: 'Medical_Support', title: 'Medical Support' },
            { id: 'Legal_Advice', title: 'Legal Advice' },
            { id: 'Counselling', title: 'Counselling' },
            { id: 'Shelter_Safe_Home', title: 'Shelter or Safe Home' },
            { id: 'other_service', title: 'Other' }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptConsent = async (to: string, lang: UserSession['language'], isServiceRequest = false) => {
  const textKey = isServiceRequest ? 'consent_prompt_direct_service' : 'consent_prompt';
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText(textKey, lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_consent', title: 'Yes, I consent' } },
        { type: 'reply', reply: { id: 'no_consent', title: 'No, I do not consent' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

const promptFollowUpUpdates = async (to: string, lang: UserSession['language']) => {
  const interactive = {
    type: 'button',
    body: { text: getLocalizedText('follow_up_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_follow_up', title: 'Yes' } },
        { type: 'reply', reply: { id: 'no_follow_up', title: 'No' } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

// ... Implement other conversation steps based on WHATSAPP INTERACTION FLOW.pdf ...
// This includes collecting incident details (date, time, location, type of violence, perpetrator, description)
// and handling media uploads. [cite: 114, 115, 116, 117, 118, 119, 120, 121, 122]
