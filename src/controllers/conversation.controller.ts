/**
 * @file Core conversation logic and state machine for the chatbot.
 */

import * as WhatsAppService from '../services/whatsapp.service';
import * as SessionManager from '../services/session.manager';
import { t, Language } from '../config/translation';

interface UserSession {
  currentStep: string;
  language?: 'English' | 'Yoruba' | 'Igbo' | 'Hausa';
  reportData: Partial<any>; // Store partial report data
  lastMessageId?: string;
}
const userSessions: Record<string, UserSession> = {};

/**
 * Processes an incoming message from a user.
 * This is the main entry point for the conversation logic.
 * @param from The sender's phone number.
 * @param message The incoming WhatsApp message object.
 */
export const processMessage = async (from: string, message: any, botPhoneNumberId: string) => {
  // --- IMPORTANT: Echo Prevention ---
  // Check if the message is from the bot itself. If so, ignore it.
  if (message.from === botPhoneNumberId) {
    console.log('Ignoring echo message from the bot itself.');
    return;
  }
  // Get or create a session for the user.
  let session = (await SessionManager.getSession(from)) || (await SessionManager.createSession(from));

  // AND...

  // Extract the user's response text from various message types.
  let userResponseText = '';
  if (message.type === 'text') {
    userResponseText = message.text.body;
  } else if (message.type === 'interactive') {
    const replyType = message.interactive.type;
    userResponseText = message.interactive[replyType].id;
  }
  // Handle other message types like media (images, audio) if needed.

  console.log(`Processing step: ${session.currentStep} for user ${from} with response: '${userResponseText}'`);

  // --- State Machine ---
  // The 'switch' statement determines what to do based on the user's current step.
  switch (session.currentStep) {
    case 'start':
      await WhatsAppService.sendLanguageSelection(from);
      session.currentStep = 'select_language';
      break;

    case 'select_language':
      const lang = userResponseText.toLowerCase();
      if (['english', 'yoruba', 'igbo', 'hausa'].includes(lang)) {
        session.language = lang as Language;
        await WhatsAppService.sendTextMessage(from, t('confirmation_language_set', session.language, session.language));
        await WhatsAppService.promptAnonymity(from, session.language);
        session.currentStep = 'select_anonymity';
      } else {
        // If the response is invalid, re-send the language selection prompt.
        await WhatsAppService.sendLanguageSelection(from);
      }
      break;

    case 'select_anonymity':
      // FIX: Check against the new button IDs
      if (userResponseText === 'option_share_details') {
        session.reportData.isAnonymous = false;
        await WhatsAppService.sendTextMessage(from, t('prompt_name', session.language));
        session.currentStep = 'enter_name';
      } else if (userResponseText === 'option_remain_anonymous') {
        session.reportData.isAnonymous = true;
        await WhatsAppService.sendTextMessage(from, t('confirmation_anonymous', session.language));
        await WhatsAppService.promptIncidentOrHelp(from, session.language!);
        session.currentStep = 'incident_or_help';
      } else {
        await WhatsAppService.promptAnonymity(from, session.language!);
      }
      break;

    case 'enter_name':
      session.reportData.reporterName = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('prompt_phone', session.language));
      session.currentStep = 'enter_phone';
      break;

    case 'enter_phone':
      if (userResponseText.toLowerCase() !== 'skip') {
        session.reportData.reporterPhone = userResponseText;
      }
      await WhatsAppService.promptIncidentOrHelp(from, session.language!);
      session.currentStep = 'incident_or_help';
      break;

    case 'incident_or_help':
      if (userResponseText === 'option_report_incident') {
        await WhatsAppService.sendTextMessage(from, t('prompt_incident_date', session.language));
        session.currentStep = 'collect_date';
      } else if (userResponseText === 'option_request_help') {
        await WhatsAppService.promptServiceSelection(from, session.language!);
        session.currentStep = 'select_services_direct';
      } else if (userResponseText === 'option_check_status') {
        await WhatsAppService.sendTextMessage(from, t('prompt_enter_reference_id', session.language));
        session.currentStep = 'enter_reference_id_for_status';
      } else {
        await WhatsAppService.promptIncidentOrHelp(from, session.language!);
      }
      break;

    case 'collect_date':
      session.reportData.incidentDate = userResponseText; // Add date validation
      await WhatsAppService.promptIncidentTime(from, session.language!);
      session.currentStep = 'collect_time';
      break;

    case 'collect_time':
      session.reportData.incidentTime = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('location_description_prompt', session.language));
      session.currentStep = 'collect_location_description';
      break;

    case 'collect_location_description':
      session.reportData.locationText = userResponseText;
      await WhatsAppService.promptExactLocationType(from, session.language!);
      session.currentStep = 'collect_exact_location_type';
      break;

    case 'collect_exact_location_type':
      session.reportData.exactLocationType = userResponseText;
      if (userResponseText.toLowerCase() === 'other_location') {
        await WhatsAppService.sendTextMessage(from, t('other_location_detail_prompt', session.language));
        session.currentStep = 'collect_other_location_detail';
      } else {
        await WhatsAppService.promptViolenceType(from, session.language!);
        session.currentStep = 'collect_violence_type';
      }
      break;

    case 'collect_other_location_detail':
      session.reportData.exactLocationType = `Other: ${userResponseText}`;
      await WhatsAppService.promptViolenceType(from, session.language!);
      session.currentStep = 'collect_violence_type';
      break;

    case 'collect_violence_type':
      session.reportData.violenceType = userResponseText;
      if (userResponseText.toLowerCase() === 'other_violence') {
        await WhatsAppService.sendTextMessage(from, t('other_violence_detail_prompt', session.language));
        session.currentStep = 'collect_other_violence_detail';
      } else {
        await WhatsAppService.promptPerpetratorKnown(from, session.language!);
        session.currentStep = 'collect_perpetrator_known';
      }
      break;

    case 'collect_other_violence_detail':
      session.reportData.violenceType = `Other: ${userResponseText}`;
      await WhatsAppService.promptPerpetratorKnown(from, session.language!);
      session.currentStep = 'collect_perpetrator_known';
      break;

    case 'collect_perpetrator_known':
      // FIX: Check against the new button IDs
      if (userResponseText === 'option_yes') {
        session.reportData.perpetratorKnown = true;
        await WhatsAppService.promptPerpetratorRelationship(from, session.language!);
        session.currentStep = 'collect_perpetrator_relationship';
      } else {
        // Assumes 'option_no' or any other reply
        session.reportData.perpetratorKnown = false;
        await WhatsAppService.sendTextMessage(from, t('prompt_incident_description', session.language));
        session.currentStep = 'collect_description';
      }
      break;

    case 'collect_perpetrator_relationship':
      session.reportData.perpetratorRelationship = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('perpetrator_count_prompt', session.language));
      session.currentStep = 'collect_perpetrator_count';
      break;

    case 'collect_perpetrator_count':
      session.reportData.perpetratorCount = userResponseText; // Validate as number
      await WhatsAppService.sendTextMessage(from, t('incident_description_prompt', session.language));
      session.currentStep = 'collect_description';
      break;

    case 'collect_description':
      session.reportData.description = userResponseText;
      await WhatsAppService.promptMediaUpload(from, session.language!);
      session.currentStep = 'collect_evidence_prompt';
      break;

    case 'collect_evidence_prompt':
      // FIX: Check against the new button IDs
      if (userResponseText === 'option_send_now') {
        await WhatsAppService.sendTextMessage(from, t('message_upload_media', session.language));
        // Waiting for media...
      } else {
        // Assumes 'option_skip'
        await WhatsAppService.promptHelpOrService(from, session.language!);
        session.currentStep = 'ask_help_or_service';
      }
      break;

    case 'ask_help_or_service':
      // FIX: Check against the new button IDs
      if (userResponseText === 'option_yes') {
        await WhatsAppService.promptServiceSelection(from, session.language!);
        session.currentStep = 'collect_services';
      } else {
        // Assumes 'option_no'
        await WhatsAppService.promptConsent(from, session.language!);
        session.currentStep = 'collect_consent';
      }
      break;

    case 'collect_services':
      session.reportData.servicesRequested = [userResponseText];
      if (userResponseText.toLowerCase() === 'other_service') {
        await WhatsAppService.sendTextMessage(from, t('other_service_detail_prompt', session.language));
        session.currentStep = 'collect_other_service_detail';
      } else {
        await WhatsAppService.promptConsent(from, session.language!);
        session.currentStep = 'collect_consent';
      }
      break;

    case 'collect_other_service_detail':
      session.reportData.servicesRequested = [`Other: ${userResponseText}`];
      await WhatsAppService.promptConsent(from, session.language!);
      session.currentStep = 'collect_consent';
      break;

    case 'select_services_direct':
      session.reportData.servicesRequested = [userResponseText];
      session.reportData.isDirectServiceRequest = true;
      await WhatsAppService.sendTextMessage(from, t('prompt_consent', session.language));
      await WhatsAppService.promptConsent(from, session.language!, true);
      session.currentStep = 'collect_consent_direct_service';
      break;

    case 'collect_consent':
    case 'collect_consent_direct_service':
      if (userResponseText.toLowerCase() === 'option_yes_consent') {
        session.reportData.consentGiven = true;
        const refId = `GBV-${Math.random().toString(36).substr(2, 5).toUpperCase()}`; // Dummy ref ID
        session.reportData.referenceId = refId;
        await WhatsAppService.sendTextMessage(from, t('report_submitted', session.language, refId));
        if (session.currentStep === 'collect_consent') {
          await WhatsAppService.sendTextMessage(from, t('report_escalation_message', session.language));
        } else {
          await WhatsAppService.sendTextMessage(from, t('service_connection_message', session.language));
        }
        await WhatsAppService.promptFollowUpUpdates(from, session.language!);
        session.currentStep = 'ask_follow_up';
      } else {
        session.reportData.consentGiven = false;
        await WhatsAppService.sendTextMessage(from, t('option_no_consent', session.language));
        SessionManager.deleteSession(from); // FIX: Use session manager to delete
        return; // FIX: Return here to prevent saving a deleted session
      }
      break;

    case 'enter_reference_id_for_status':
      // TODO: Implement status check logic
      await WhatsAppService.sendTextMessage(from, t('status_check_message', session.language, userResponseText));
      SessionManager.deleteSession(from); // FIX: Use session manager to delete
      return; // FIX: Return here to prevent saving a deleted session

    case 'ask_follow_up':
      if (userResponseText.toLowerCase() === 'option_yes') {
        await WhatsAppService.sendTextMessage(from, t('follow_up_confirmation', session.language));
      } else {
        await WhatsAppService.sendTextMessage(from, t('no_follow_up_message', session.language));
      }
      SessionManager.deleteSession(from); // FIX: Use session manager to delete
      return; // FIX: Return here to prevent saving a deleted session

    default:
      // If the step is unknown, reset the conversation.
      await WhatsAppService.sendTextMessage(from, "Sorry, I lost my place. Let's start over.");
      await WhatsAppService.sendLanguageSelection(from);
      session.currentStep = 'select_language';
      break;
  }

  // Save the updated session state for the user.
  SessionManager.updateSession(from, session);
};
