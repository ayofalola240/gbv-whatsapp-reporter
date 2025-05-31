/**
 * @file Handles all interactions with the WhatsApp Cloud API.
 */

import axios from 'axios';
import { config } from '../config';
import { t, Language } from '../config/translation';

const WHATSAPP_ACCESS_TOKEN = config.whatsappAccessToken;
const FCTA_PHONE_NUMBER_ID = config.whatsappPhoneNumberId;

const whatsappAPI = axios.create({
  baseURL: `https://graph.facebook.com/v19.0/${FCTA_PHONE_NUMBER_ID}`,
  headers: {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

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

export const sendTextMessage = async (to: string, text: string) => {
  return sendWhatsAppMessage(to, { type: 'text', text: { body: text } });
};

export const sendInteractiveMessage = async (to: string, interactive: any) => {
  return sendWhatsAppMessage(to, { type: 'interactive', interactive });
};

// --- Prompt Sending Functions (Corrected) ---

export const sendLanguageSelection = async (to: string) => {
  const interactive = {
    type: 'list',
    body: { text: t('prompt_welcome') }, // CHANGED
    action: {
      button: t('button_select_language'),
      sections: [
        {
          title: t('section_languages'),
          rows: [
            // These IDs are correct as they match the logic in the controller
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

export const promptAnonymity = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('prompt_anonymity', lang) },
    action: {
      buttons: [
        // CHANGED: Using consistent option keys for IDs and titles
        { type: 'reply', reply: { id: 'option_remain_anonymous', title: t('option_remain_anonymous', lang) } },
        { type: 'reply', reply: { id: 'option_share_details', title: t('option_share_details', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

// in ./services/whatsapp.service.ts

export const promptIncidentOrHelp = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list', // CHANGED from 'button' to 'list'
    body: { text: t('prompt_main_menu', lang) },
    action: {
      button: t('button_choose_option', lang), // Text for the button that opens the list
      sections: [
        {
          title: t('section_main_menu', lang),
          rows: [
            { id: 'option_report_incident', title: t('option_report_incident', lang) },
            { id: 'option_request_help', title: t('option_request_help', lang) },
            { id: 'option_check_status', title: t('option_check_status', lang) },
            // NEW: The restart option. Its ID triggers the logic from Step 1.
            { id: 'restart', title: t('option_start_over', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptIncidentTime = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('prompt_incident_time', lang) }, // CHANGED
    action: {
      button: t('button_select_time'), // CHANGED
      sections: [
        {
          title: t('section_time_of_day', lang), // CHANGED
          rows: [
            // IDs are the actual data values, titles use translation keys
            { id: 'Morning', title: t('option_morning', lang) },
            { id: 'Afternoon', title: t('option_afternoon', lang) },
            { id: 'Evening', title: t('option_evening', lang) },
            { id: 'Night', title: t('option_night', lang) },
            { id: 'Not_Sure_Time', title: t('option_not_sure', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptExactLocationType = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('prompt_location_specific', lang) }, // CHANGED
    action: {
      button: t('button_select_location'), // CHANGED
      sections: [
        {
          title: t('section_location_types', lang), // CHANGED
          rows: [
            { id: 'Home', title: t('option_home', lang) },
            { id: 'School', title: t('option_school', lang) },
            { id: 'Workplace', title: t('option_workplace', lang) },
            { id: 'Street_or_Road', title: t('option_street_road', lang) },
            { id: 'Perpetrators_house', title: t('option_perpetrators_house', lang) },
            { id: 'other_location', title: t('option_other', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptViolenceType = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('prompt_violence_type', lang) }, // CHANGED
    action: {
      button: t('button_select_violence'), // CHANGED
      sections: [
        {
          title: t('section_violence_types', lang), // Ensure this key exists in your translations
          rows: [
            // Add corresponding 'option_*' keys to your translation file for these
            { id: 'Sexual_Assault', title: 'Sexual Assault' }, // Example: t('option_sexual_assault', lang)
            { id: 'Rape', title: 'Rape' },
            { id: 'Defilement', title: 'Defilement' },
            { id: 'Physical_Assault', title: 'Physical Assault' },
            { id: 'Psychological_Abuse', title: 'Psychological Abuse' },
            { id: 'Forced_Marriage', title: 'Forced Marriage' },
            { id: 'Online_Harassment', title: 'Online Harassment' },
            { id: 'other_violence', title: t('option_other', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptPerpetratorKnown = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('prompt_perpetrator_known', lang) }, // CHANGED
    action: {
      buttons: [
        // CHANGED: Using consistent option keys for IDs
        { type: 'reply', reply: { id: 'option_yes', title: t('option_yes', lang) } },
        { type: 'reply', reply: { id: 'option_no', title: t('option_no', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptPerpetratorRelationship = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('prompt_perpetrator_relationship', lang) }, // CHANGED
    action: {
      button: t('button_select_relationship'), // CHANGED
      sections: [
        {
          title: t('section_relationship_types', lang), // Ensure this key exists
          rows: [
            // Add corresponding 'option_*' keys to your translation file for these
            { id: 'Spouse_Partner', title: 'Spouse/Partner' },
            { id: 'Relative', title: 'Relative' },
            { id: 'Teacher', title: 'Teacher' },
            { id: 'Police_Authority', title: 'Police/Authority' },
            { id: 'Stranger', title: 'Stranger' },
            { id: 'other_relationship', title: t('option_other', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptMediaUpload = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('prompt_media_upload', lang) }, // CHANGED
    action: {
      buttons: [
        // CHANGED: Using consistent option keys for IDs
        { type: 'reply', reply: { id: 'option_send_now', title: t('option_send_now', lang) } },
        { type: 'reply', reply: { id: 'option_skip', title: t('option_skip', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptHelpOrService = async (to: string, lang: Language, isDirectRequest = false) => {
  if (isDirectRequest) {
    // If it's a direct request, go straight to service selection
    await promptServiceSelection(to, lang);
  } else {
    // Otherwise, ask if they need help
    const interactive = {
      type: 'button',
      body: { text: t('prompt_need_support_incident', lang) }, // CHANGED
      action: {
        buttons: [
          // CHANGED: Using consistent option keys for IDs
          { type: 'reply', reply: { id: 'option_yes', title: t('option_yes', lang) } },
          { type: 'reply', reply: { id: 'option_no', title: t('option_no', lang) } }
        ]
      }
    };
    await sendInteractiveMessage(to, interactive);
  }
};

export const promptServiceSelection = async (to: string, lang: Language) => {
  const interactive = {
    type: 'list',
    body: { text: t('prompt_select_services', lang) }, // Ensure this key exists
    action: {
      button: t('button_select_service'), // CHANGED
      sections: [
        {
          title: t('section_support_services', lang), // Ensure this key exists
          rows: [
            // Add corresponding 'option_*' keys to your translation file for these
            { id: 'Police_Security', title: 'Police/Security' },
            { id: 'Medical_Support', title: 'Medical Support' },
            { id: 'Legal_Advice', title: 'Legal Advice' },
            { id: 'Counselling', title: 'Counselling' },
            { id: 'Shelter_Safe_Home', title: 'Shelter or Safe Home' },
            { id: 'other_service', title: t('option_other', lang) }
          ]
        }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptConsent = async (to: string, lang: Language, isServiceRequest = false) => {
  const textKey = isServiceRequest ? 'prompt_consent_direct_service' : 'prompt_consent'; // CHANGED
  const interactive = {
    type: 'button',
    body: { text: t(textKey, lang) },
    action: {
      buttons: [
        // CHANGED: Using consistent option keys for IDs
        { type: 'reply', reply: { id: 'option_yes_consent', title: t('option_yes_consent', lang) } },
        { type: 'reply', reply: { id: 'option_no_consent', title: t('option_no_consent', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};

export const promptFollowUpUpdates = async (to: string, lang: Language) => {
  const interactive = {
    type: 'button',
    body: { text: t('prompt_follow_up', lang) }, // CHANGED
    action: {
      buttons: [
        // CHANGED: Using consistent option keys for IDs
        { type: 'reply', reply: { id: 'option_yes', title: t('option_yes', lang) } },
        { type: 'reply', reply: { id: 'option_no', title: t('option_no', lang) } }
      ]
    }
  };
  await sendInteractiveMessage(to, interactive);
};
