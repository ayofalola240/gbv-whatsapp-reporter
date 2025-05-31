/**
 * @file Handles all interactions with the WhatsApp Cloud API.
 */

import axios from 'axios';
import { config } from '../config';
import { t, Language } from '../config/translation';

const WHATSAPP_ACCESS_TOKEN = config.whatsappAccessToken;
const FCTA_PHONE_NUMBER_ID = config.whatsappPhoneNumberId;

// Create an Axios instance for the WhatsApp API
const whatsappAPI = axios.create({
  baseURL: `https://graph.facebook.com/v19.0/${FCTA_PHONE_NUMBER_ID}`,
  headers: {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * A generic function to send a message to the WhatsApp API.
 * @param to The recipient's phone number.
 * @param message The message object (can be text, interactive, etc.).
 * @returns The response data from the API.
 */
export const sendWhatsAppMessage = async (to: string, message: any) => {
  try {
    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      ...message
    };
    const response = await whatsappAPI.post('/messages', payload);
    console.log('WhatsApp message sent successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Sends a simple text message.
 * @param to The recipient's phone number.
 * @param text The text to send.
 */
export const sendTextMessage = async (to: string, text: string) => {
  return sendWhatsAppMessage(to, { type: 'text', text: { body: text } });
};

/**
 * Sends an interactive message.
 * @param to The recipient's phone number.
 * @param interactive The interactive message payload.
 */
export const sendInteractiveMessage = async (to: string, interactive: any) => {
  return sendWhatsAppMessage(to, { type: 'interactive', interactive });
};

// --- Prompt Sending Functions ---

// --- Prompt Sending Functions ---

/**
 * Sends the initial language selection list.
 * @param to The recipient's phone number.
 */
export const sendLanguageSelection = async (to: string) => {
  const interactive = {
    type: 'list',
    body: { text: t('welcome_message') },
    action: {
      button: t('select_language_button'),
      sections: [
        {
          title: t('language_section_title'),
          rows: [
            { id: 'english', title: 'English' },
            { id: 'yoruba', title: 'Yoruba' },
            { id: 'igbo', title: 'Igbo' },
            { id: 'hausa', title: 'Hausa' }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the anonymity prompt with buttons.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptAnonymity = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('anonymity_prompt', lang) },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: { id: 'remain_anonymous', title: t('remain_anonymous_option', lang) }
        },
        {
          type: 'reply',
          reply: { id: 'share_details', title: t('share_details_option', lang) }
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the main menu prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptIncidentOrHelp = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('incident_or_help_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'report_incident', title: t('report_incident_option', lang) } },
        { type: 'reply', reply: { id: 'request_help', title: t('request_help_option', lang) } },
        { type: 'reply', reply: { id: 'check_status', title: t('check_status_option', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the incident time prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptIncidentTime = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('incident_time_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'Morning', title: t('morning_option', lang) } },
        { type: 'reply', reply: { id: 'Afternoon', title: t('afternoon_option', lang) } },
        { type: 'reply', reply: { id: 'Evening', title: t('evening_option', lang) } },
        { type: 'reply', reply: { id: 'Night', title: t('night_option', lang) } },
        { type: 'reply', reply: { id: 'Nottip:Not_Sure_Time', title: t('not_sure_option', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the exact location type prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptExactLocationType = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('exact_location_prompt', lang) },
    action: {
      button: t('select_location_button', lang),
      sections: [
        {
          title: t('location_section_title', lang),
          rows: [
            { id: 'Home', title: t('home_option', lang) },
            { id: 'School', title: t('school_option', lang) },
            { id: 'Workplace', title: t('workplace_option', lang) },
            { id: 'Street_or_Road', title: t('street_or_road_option', lang) },
            { id: 'Perpetrators_house', title: t('perpetrators_house_option', lang) },
            { id: 'other_location', title: t('other_location_option', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the violence type prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptViolenceType = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('violence_type_prompt', lang) },
    action: {
      button: t('select_violence_button', lang),
      sections: [
        {
          title: t('violence_section_title', lang),
          rows: [
            { id: 'Sexual_Assault', title: t('sexual_assault_option', lang) },
            { id: 'Rape', title: t('rape_option', lang) },
            { id: 'Defilement', title: t('defilement_option', lang) },
            { id: 'Physical_Assault', title: t('physical_assault_option', lang) },
            { id: 'Psychological_Abuse', title: t('psychological_abuse_option', lang) },
            { id: 'Forced_Marriage', title: t('forced_marriage_option', lang) },
            { id: 'Online_Harassment', title: t('online_harassment_option', lang) },
            { id: 'other_violence', title: t('other_violence_option', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the perpetrator known prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptPerpetratorKnown = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('perpetrator_known_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_know_perpetrator', title: t('yes_option', lang) } },
        { type: 'reply', reply: { id: 'no_know_perpetrator', title: t('no_option', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the perpetrator relationship prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptPerpetratorRelationship = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('perpetrator_relationship_prompt', lang) },
    action: {
      button: t('select_relationship_button', lang),
      sections: [
        {
          title: t('relationship_section_title', lang),
          rows: [
            { id: 'Spouse_Partner', title: t('spouse_partner_option', lang) },
            { id: 'Relative', title: t('relative_option', lang) },
            { id: 'Teacher', title: t('teacher_option', lang) },
            { id: 'Police_Authority', title: t('police_authority_option', lang) },
            { id: 'Stranger', title: t('stranger_option', lang) },
            { id: 'Other_Relationship', title: t('other_relationship_option', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the media upload prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptMediaUpload = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('media_upload_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'send_now', title: t('send_now_option', lang) } },
        { type: 'reply', reply: { id: 'skip_media', title: t('skip_media_option', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the help or service prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 * @param isDirectRequest Whether this is a direct request for services.
 */
export const promptHelpOrService = async (to: string, lang: Language, isDirectRequest = false) => {
  const text = isDirectRequest ? t('select_services_prompt', lang) : t('help_or_service_prompt', lang);
  const interactive = {
    type: 'button',
    body: { text },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_need_help', title: t('yes_option', lang) } },
        { type: 'reply', reply: { id: 'no_need_help', title: t('no_option', lang) } }
      ]
    }
  };
  if (isDirectRequest) {
    await promptServiceSelection(to, lang);
  } else {
    await sendInteractiveMessage(to, interactive);
  }
};

/**
 * Sends the service selection prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptServiceSelection = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('select_services_prompt', lang) },
    action: {
      button: t('select_service_button', lang),
      sections: [
        {
          title: t('support_section_title', lang),
          rows: [
            { id: 'Police_Security', title: t('police_security_option', lang) },
            { id: 'Medical_Support', title: t('medical_support_option', lang) },
            { id: 'Legal_Advice', title: t('legal_advice_option', lang) },
            { id: 'Counselling', title: t('counselling_option', lang) },
            { id: 'Shelter_Safe_Home', title: t('shelter_safe_home_option', lang) },
            { id: 'other_service', title: t('other_service_option', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the consent prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 * @param isServiceRequest Whether this is for a direct service request.
 */
export const promptConsent = async (to: string, lang: Language, isServiceRequest = false) => {
  const textKey = isServiceRequest ? 'consent_prompt_direct_service' : 'consent_prompt';
  const interactive = {
    type: 'button',
    body: { text: t(textKey, lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_consent', title: t('yes_consent_option', lang) } },
        { type: 'reply', reply: { id: 'no_consent', title: t('no_consent_option', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

/**
 * Sends the follow-up updates prompt.
 * @param to The recipient's phone number.
 * @param lang The selected language for the user.
 */
export const promptFollowUpUpdates = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('follow_up_prompt', lang) },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'yes_follow_up', title: t('yes_option', lang) } },
        { type: 'reply', reply: { id: 'no_follow_up', title: t('no_option', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};
