/**
 * @file Core conversation logic and state machine for the chatbot.
 */

import * as WhatsAppService from '../services/whatsapp.service';
import * as ReportService from '../services/report.service';
import * as SessionManager from '../services/session.manager';
import { t, Language } from '../config/translation';

// Interface UserSession should be defined in session.manager.ts and imported if needed
// For this file, it's not directly used if session object structure is handled by SessionManager

export const processMessage = async (from: string, message: any, botPhoneNumberId: string) => {
  if (message.from === botPhoneNumberId) {
    console.log('Ignoring echo message from the bot itself.');
    return;
  }

  // const restartKeywords = ['restart', 'reset', 'menu', 'start over'];
  // if (message.type === 'text' && restartKeywords.includes(message.text.body.toLowerCase().trim())) {
  //   console.log(`User ${from} initiated a restart.`);
  //   await SessionManager.deleteSession(from);
  //   await WhatsAppService.sendLanguageSelection(from);
  //   return;
  // }
  const restartKeywords = ['restart', 'reset', 'menu', 'start over'];
  if (message.type === 'text' && restartKeywords.includes(message.text.body.toLowerCase().trim())) {
    console.log(`User ${from} initiated a restart.`);
    await SessionManager.deleteSession(from);
    // ADDED: Specific restart message
    await WhatsAppService.sendTextMessage(from, t('message_restart'));
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
      await WhatsAppService.sendTextMessage(from, t('prompt_welcome'));
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
      await WhatsAppService.promptConfirmPhoneNumber(from, session.language!);
      session.currentStep = 'confirm_phone_number';
      break;

    case 'confirm_phone_number':
      if (userResponseText === 'option_yes') {
        // User said 'Yes', so we automatically grab their WhatsApp number (`from`)
        session.reportData.reporterPhone = from;
        await WhatsAppService.sendTextMessage(from, t('confirmation_phone_saved', session.language!)); // Optional: Add a confirmation message
        await WhatsAppService.promptIncidentOrHelp(from, session.language!);
        session.currentStep = 'incident_or_help';
      } else if (userResponseText === 'option_no') {
        // User said 'No', so now we ask them to type the correct number
        await WhatsAppService.sendTextMessage(from, t('prompt_enter_different_phone', session.language!));
        session.currentStep = 'enter_different_phone';
      } else {
        // If the user's response is not 'option_yes' or 'option_no', re-ask the question.
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptConfirmPhoneNumber(from, session.language!);
      }
      break;

    case 'enter_different_phone':
      // TODO: Add validation here to ensure it's a valid phone number.
      session.reportData.reporterPhone = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('confirmation_phone_saved', session.language!)); // Optional: Add confirmation
      await WhatsAppService.promptIncidentOrHelp(from, session.language!);
      session.currentStep = 'incident_or_help';
      break;

    case 'incident_or_help':
      if (userResponseText === 'option_report_incident') {
        await WhatsAppService.sendTextMessage(from, t('message_report_start', session.language!));
        await WhatsAppService.sendTextMessage(from, t('prompt_incident_date', session.language!));
        session.currentStep = 'collect_date';
      } else if (userResponseText === 'option_request_help') {
        await WhatsAppService.promptServiceSelection(from, session.language!); // Changed from promptHelpOrService to directly show services
        session.currentStep = 'select_services_direct';
      } else if (userResponseText === 'option_check_status') {
        await WhatsAppService.sendTextMessage(from, t('prompt_enter_reference_id', session.language));
        session.currentStep = 'enter_reference_id_for_status';
      } else if (userResponseText === 'restart') {
        // Handle restart from main menu if it's sent as an ID
        console.log(`User ${from} initiated a restart from main menu.`);
        await SessionManager.deleteSession(from);
        await WhatsAppService.sendLanguageSelection(from);
        return;
      } else {
        await WhatsAppService.promptIncidentOrHelp(from, session.language!);
      }
      break;

    case 'collect_date':
      // TODO: Add date validation
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
      const validLocationOptions = ['Home', 'School', 'Workplace', 'Street_or_Road', 'Perpetrators_house', 'option_other'];
      if (!validLocationOptions.includes(userResponseText)) {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!)); // Ensure lang is passed
        await WhatsAppService.promptExactLocationType(from, session.language!);
        break;
      }
      session.reportData.exactLocationType = userResponseText;
      if (userResponseText === 'option_other') {
        await WhatsAppService.sendTextMessage(from, t('prompt_other_location', session.language!));
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
      // Assuming userResponseText is one of 'Physical', 'Sexual', 'Emotional', 'Trafficking', or 'option_other'
      const validViolenceOptions = ['Physical', 'Sexual', 'Emotional', 'Trafficking', 'option_other'];
      if (!validViolenceOptions.includes(userResponseText)) {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptViolenceType(from, session.language!);
        break;
      }
      session.reportData.violenceType = userResponseText;
      if (userResponseText === 'option_other') {
        await WhatsAppService.sendTextMessage(from, t('prompt_other_violence', session.language!));
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
      } else if (userResponseText === 'option_no') {
        session.reportData.perpetratorKnown = false;
        await WhatsAppService.sendTextMessage(from, t('prompt_incident_description', session.language!));
        session.currentStep = 'collect_description';
      } else {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptPerpetratorKnown(from, session.language!);
      }
      break;

    case 'collect_perpetrator_relationship':
      // Assuming userResponseText is one of 'Spouse/Partner', 'Relative', etc. or 'option_other'
      const validRelationshipOptions = ['Spouse/Partner', 'Relative', 'Teacher', 'Police/Authority', 'Stranger', 'option_other'];
      if (!validRelationshipOptions.includes(userResponseText)) {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptPerpetratorRelationship(from, session.language!);
        break;
      }
      session.reportData.perpetratorRelationship = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('prompt_perpetrator_count', session.language!));
      session.currentStep = 'collect_perpetrator_count';
      break;

    case 'collect_perpetrator_count':
      // TODO: Add validation for number
      session.reportData.perpetratorCount = userResponseText;
      await WhatsAppService.sendTextMessage(from, t('prompt_incident_description', session.language!));
      session.currentStep = 'collect_description';
      break;

    case 'collect_description':
      session.reportData.description = userResponseText;
      await WhatsAppService.promptMediaUpload(from, session.language!);
      session.currentStep = 'collect_evidence_prompt';
      break;

    case 'collect_evidence_prompt':
      if (userResponseText === 'option_send_now') {
        await WhatsAppService.sendTextMessage(from, t('message_upload_media', session.language!));
        // Waiting for media, state remains 'collect_evidence_prompt' or changes based on media handling
      } else if (userResponseText === 'option_skip') {
        await WhatsAppService.promptHelpOrService(from, session.language!); // Pass isDirectRequest = false (default)
        session.currentStep = 'ask_help_or_service';
      } else {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptMediaUpload(from, session.language!);
      }
      break;

    case 'ask_help_or_service':
      if (userResponseText === 'option_yes') {
        await WhatsAppService.promptServiceSelection(from, session.language!);
        session.currentStep = 'collect_services';
      } else if (userResponseText === 'option_no') {
        await WhatsAppService.promptConsent(from, session.language!);
        session.currentStep = 'collect_consent';
      } else {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptHelpOrService(from, session.language!);
      }
      break;

    case 'collect_services':
      // Assuming userResponseText is one of 'Medical', 'Psychological', etc. or 'option_other'
      // This logic is for Option 1 (Sequential Multi-select) from previous advice
      if (!session.reportData.servicesRequested) {
        session.reportData.servicesRequested = [];
      }
      const validServiceOptions = ['Medical', 'Psychological', 'Counselling', 'Police/Security', 'Legal', 'Shelter', 'option_other'];
      if (!validServiceOptions.includes(userResponseText)) {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptServiceSelection(from, session.language!); // Re-show the list
        break;
      }

      if (userResponseText !== 'option_other') {
        session.reportData.servicesRequested.push(userResponseText);
      }

      if (userResponseText === 'option_other') {
        await WhatsAppService.sendTextMessage(from, t('prompt_other_service', session.language!));
        session.currentStep = 'collect_other_service_detail_multi';
      } else {
        await WhatsAppService.promptAddMoreServices(from, session.language!);
        session.currentStep = 'ask_add_more_services';
      }
      break;

    case 'ask_add_more_services': // For multi-select services
      if (userResponseText === 'option_yes') {
        await WhatsAppService.promptServiceSelection(from, session.language!);
        session.currentStep = 'collect_services';
      } else if (userResponseText === 'option_no') {
        await WhatsAppService.promptConsent(from, session.language!);
        session.currentStep = 'collect_consent';
      } else {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptAddMoreServices(from, session.language!);
      }
      break;

    case 'collect_other_service_detail_multi': // For multi-select 'other' service
      if (!session.reportData.servicesRequested) {
        // Safety check
        session.reportData.servicesRequested = [];
      }
      session.reportData.servicesRequested.push(`Other: ${userResponseText}`);
      await WhatsAppService.promptAddMoreServices(from, session.language!);
      session.currentStep = 'ask_add_more_services';
      break;

    case 'collect_other_service_detail': // Original single 'other' service
      session.reportData.servicesRequested = [`Other: ${userResponseText}`];
      await WhatsAppService.promptConsent(from, session.language!);
      session.currentStep = 'collect_consent';
      break;

    case 'select_services_direct':
      // This step assumes user selected a service directly from the main menu's 'request_help' option
      // which now calls promptServiceSelection. The response will be a service ID or 'option_other'.
      if (!session.reportData.servicesRequested) {
        session.reportData.servicesRequested = [];
      }
      session.reportData.isDirectServiceRequest = true;

      const validDirectServiceOptions = ['Medical', 'Psychological', 'Counselling', 'Police/Security', 'Legal', 'Shelter', 'option_other'];
      if (!validDirectServiceOptions.includes(userResponseText)) {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptServiceSelection(from, session.language!); // Re-show the list
        session.currentStep = 'select_services_direct'; // Stay in this step to retry
        break;
      }

      if (userResponseText === 'option_other') {
        await WhatsAppService.sendTextMessage(from, t('prompt_other_service', session.language!));
        session.currentStep = 'collect_other_service_detail_direct'; // New step for 'other' in direct request
      } else {
        session.reportData.servicesRequested.push(userResponseText);
        // Ask if they want to add more, even in direct request
        await WhatsAppService.promptAddMoreServices(from, session.language!);
        session.currentStep = 'ask_add_more_services_direct';
      }
      break;

    case 'ask_add_more_services_direct':
      if (userResponseText === 'option_yes') {
        await WhatsAppService.promptServiceSelection(from, session.language!);
        session.currentStep = 'select_services_direct'; // Go back to select more services
      } else if (userResponseText === 'option_no') {
        await WhatsAppService.promptConsent(from, session.language!, true); // isServiceRequest = true
        session.currentStep = 'collect_consent_direct_service';
      } else {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptAddMoreServices(from, session.language!);
      }
      break;

    case 'collect_other_service_detail_direct':
      if (!session.reportData.servicesRequested) {
        session.reportData.servicesRequested = [];
      }
      session.reportData.servicesRequested.push(`Other: ${userResponseText}`);
      await WhatsAppService.promptAddMoreServices(from, session.language!);
      session.currentStep = 'ask_add_more_services_direct';
      break;

    case 'collect_consent':
    case 'collect_consent_direct_service':
      if (userResponseText === 'option_yes_consent') {
        session.reportData.consentGiven = true;
        const refId = `GBV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        session.reportData.referenceId = refId;

        try {
          await WhatsAppService.sendTextMessage(from, t('confirmation_report_saved', session.language!));
          await ReportService.saveIncidentReport(session.reportData);
          // await WhatsAppService.sendTextMessage(from, t('message_report_submitted', session.language, refId));
          // if (session.currentStep === 'collect_consent_direct_service' || session.reportData.isDirectServiceRequest) {
          //   // Check direct service flag
          //   await WhatsAppService.sendTextMessage(from, t('message_service_connection', session.language!));
          // } else {
          //   // It's a full incident report
          //   await WhatsAppService.sendTextMessage(from, t('message_escalation', session.language!));
          // }
          await WhatsAppService.sendTextMessage(from, t('message_report_submitted', session.language!, refId));

          await WhatsAppService.promptFollowUpUpdates(from, session.language!);
          session.currentStep = 'ask_follow_up';
        } catch (dbError) {
          await WhatsAppService.sendTextMessage(from, t('error_submission_failed', session.language!));
        }
      } else if (userResponseText === 'option_no_consent') {
        session.reportData.consentGiven = false;
        await WhatsAppService.sendTextMessage(from, t('message_consent_refused', session.language!));
        await SessionManager.deleteSession(from);
        return;
      } else {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        const isServiceRequest = session.currentStep === 'collect_consent_direct_service' || session.reportData.isDirectServiceRequest;
        await WhatsAppService.promptConsent(from, session.language!, isServiceRequest);
      }
      break;

    // RE-ADDED AND CORRECTED CASE
    case 'enter_reference_id_for_status':
      // TODO: Implement actual status check logic against the database
      await WhatsAppService.sendTextMessage(from, t('message_status_check', session.language!, userResponseText));
      await SessionManager.deleteSession(from);
      return;

    // RE-ADDED AND CORRECTED CASE
    case 'ask_follow_up':
      if (userResponseText === 'option_yes') {
        await WhatsAppService.sendTextMessage(from, t('confirmation_follow_up', session.language!));
      } else if (userResponseText === 'option_no') {
        await WhatsAppService.sendTextMessage(from, t('message_no_follow_up', session.language!));
      } else {
        await WhatsAppService.sendTextMessage(from, t('error_invalid_option', session.language!));
        await WhatsAppService.promptFollowUpUpdates(from, session.language!);
        break; // break to allow session update and re-prompt
      }
      await SessionManager.deleteSession(from);
      return;

    default:
      await WhatsAppService.sendTextMessage(from, "Sorry, I lost my place. Let's start over.");
      await WhatsAppService.sendLanguageSelection(from);
      session.currentStep = 'select_language';
      break;
  }

  if (await SessionManager.getSession(from)) {
    await SessionManager.updateSession(from, session);
  }
};
