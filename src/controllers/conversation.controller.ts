import * as WhatsAppService from '../services/whatsapp.service';
import * as ReportService from '../services/report.service';
import * as SessionManager from '../services/session.manager';
import { t, Language } from '../config/translation';

export const processMessage = async (from: string, message: any, botPhoneNumberId: string) => {
  if (message.from === botPhoneNumberId) {
    console.log('Ignoring echo message from the bot itself.');
    return;
  }

  // --- NEW: Add the restart logic here ---
  const restartKeywords = ['restart', 'reset', 'menu', 'start over'];
  if (message.type === 'text' && restartKeywords.includes(message.text.body.toLowerCase().trim())) {
    console.log(`User ${from} initiated a restart.`);
    await SessionManager.deleteSession(from);
    await WhatsAppService.sendLanguageSelection(from);
    return;
  }

  let session = (await SessionManager.getSession(from)) || (await SessionManager.createSession(from));

  let userResponseText = '';
  if (message.type === 'text') {
    userResponseText = message.text.body;
  } else if (message.type === 'interactive') {
    const replyType = message.interactive.type;
    userResponseText = message.interactive[replyType].id;
  }

  console.log(`Processing step: ${session.currentStep} for user ${from} with response: '${userResponseText}'`);

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
        await WhatsAppService.sendLanguageSelection(from);
      }
      break;

    case 'select_anonymity':
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
      session.reportData.incidentDate = userResponseText;
      await WhatsAppService.promptIncidentTime(from, session.language!);
      session.currentStep = 'collect_time';
      break;

    case 'collect_time':
      session.reportData.incidentTime = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('prompt_location_description', session.language));
      session.currentStep = 'collect_location_description';
      break;

    case 'collect_location_description':
      session.reportData.locationText = userResponseText;
      await WhatsAppService.promptExactLocationType(from, session.language!);
      session.currentStep = 'collect_exact_location_type';
      break;

    case 'collect_exact_location_type':
      session.reportData.exactLocationType = userResponseText;

      if (userResponseText === 'option_other') {
        await WhatsAppService.sendTextMessage(from, t('prompt_other_location', session.language));
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

      if (userResponseText === 'option_other') {
        await WhatsAppService.sendTextMessage(from, t('prompt_other_violence', session.language));
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
      if (userResponseText === 'option_yes') {
        session.reportData.perpetratorKnown = true;
        await WhatsAppService.promptPerpetratorRelationship(from, session.language!);
        session.currentStep = 'collect_perpetrator_relationship';
      } else {
        session.reportData.perpetratorKnown = false;
        await WhatsAppService.sendTextMessage(from, t('prompt_incident_description', session.language));
        session.currentStep = 'collect_description';
      }
      break;

    case 'collect_perpetrator_relationship':
      session.reportData.perpetratorRelationship = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('prompt_perpetrator_count', session.language));
      session.currentStep = 'collect_perpetrator_count';
      break;

    case 'collect_perpetrator_count':
      session.reportData.perpetratorCount = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('prompt_incident_description', session.language));
      session.currentStep = 'collect_description';
      break;

    case 'collect_description':
      session.reportData.description = userResponseText;
      await WhatsAppService.promptMediaUpload(from, session.language!);
      session.currentStep = 'collect_evidence_prompt';
      break;

    case 'collect_evidence_prompt':
      if (userResponseText === 'option_send_now') {
        await WhatsAppService.sendTextMessage(from, t('message_upload_media', session.language));
      } else {
        await WhatsAppService.promptHelpOrService(from, session.language!);
        session.currentStep = 'ask_help_or_service';
      }
      break;

    case 'ask_help_or_service':
      if (userResponseText === 'option_yes') {
        await WhatsAppService.promptServiceSelection(from, session.language!);
        session.currentStep = 'collect_services';
      } else {
        await WhatsAppService.promptConsent(from, session.language!);
        session.currentStep = 'collect_consent';
      }
      break;

    case 'collect_services':
      session.reportData.servicesRequested = [userResponseText];

      if (userResponseText === 'option_other') {
        await WhatsAppService.sendTextMessage(from, t('prompt_other_service', session.language));
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
      await WhatsAppService.promptConsent(from, session.language!, true);
      session.currentStep = 'collect_consent_direct_service';
      break;

    // --- THIS IS THE MODIFIED CASE ---
    case 'collect_consent':
    case 'collect_consent_direct_service':
      if (userResponseText === 'option_yes_consent') {
        session.reportData.consentGiven = true;

        // Generate a more unique reference ID
        const refId = `GBV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        session.reportData.referenceId = refId;

        // --- NEW: Save to Database with Error Handling ---
        try {
          // Call the service to save the report data from the session
          await ReportService.saveIncidentReport(session.reportData);

          // Only send success messages if the report was saved successfully
          await WhatsAppService.sendTextMessage(from, t('message_report_submitted', session.language, refId));

          if (session.currentStep === 'collect_consent') {
            await WhatsAppService.sendTextMessage(from, t('message_escalation', session.language));
          } else {
            await WhatsAppService.sendTextMessage(from, t('message_service_connection', session.language));
          }

          await WhatsAppService.promptFollowUpUpdates(from, session.language!);
          session.currentStep = 'ask_follow_up';
        } catch (dbError) {
          // If the database save fails, inform the user and do not proceed.
          await WhatsAppService.sendTextMessage(from, t('error_submission_failed', session.language));
          // We don't delete the session here, so the user can potentially try again later.
        }
      } else {
        // This part is for when consent is denied
        session.reportData.consentGiven = false;
        await WhatsAppService.sendTextMessage(from, t('message_consent_refused', session.language));
        await SessionManager.deleteSession(from);
        return; // Important: exit to prevent further processing
      }
      break;

    default:
      await WhatsAppService.sendTextMessage(from, "Sorry, I lost my place. Let's start over.");
      await WhatsAppService.sendLanguageSelection(from);
      session.currentStep = 'select_language';
      break;
  }

  // Save the updated session state for the user unless it was deleted
  if (await SessionManager.getSession(from)) {
    await SessionManager.updateSession(from, session);
  }
};
