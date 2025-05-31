// import { IIncidentReport, IncidentReport } from '../../models/incidentReport.model';
// import { Agency } from '../../models/agency.model';
// import { EscalationLog } from '../../models/escalationLog.model';
// import { generateIncidentPDF } from './pdf.service';
// import { sendEmailWithAttachment } from './email.service';
// import path from 'path';

// const FCTA_EMAIL = process.env.FCTA_EMAIL || 'womensaffairs@fcta.gov.ng';

// export const escalateIncident = async (reportId: string) => {
//   const report = await IncidentReport.findById(reportId);
//   if (!report || report.status === 'Escalated') {
//     console.log(`Report ${reportId} not found or already escalated.`);
//     return;
//   }

//   const agenciesToNotify: { email: string; name: string; id: string }[] = [];

//   // Rule 1: Always FCTA Women's Affairs Secretariat [cite: 22]
//   // Assuming FCTA is an agency in the DB or we use a default email
//   const fctaAgency = await Agency.findOne({ name: "FCTA Women's Affairs Secretariat" }); // Or a more robust lookup
//   if (fctaAgency && fctaAgency.contactEmail) {
//     agenciesToNotify.push({ email: fctaAgency.contactEmail, name: fctaAgency.name, id: fctaAgency.id });
//   } else {
//     agenciesToNotify.push({ email: FCTA_EMAIL, name: "FCTA Women's Affairs Secretariat", id: 'FCTA_DEFAULT_ID' }); // Fallback
//   }

//   // Rule 2: Trafficking to NAPTIP
//   if (report.violenceType === 'Trafficking') {
//     const naptip = await Agency.findOne({ name: 'NAPTIP' });
//     if (naptip && naptip.contactEmail && naptip.active)
//       agenciesToNotify.push({ email: naptip.contactEmail, name: naptip.name, id: naptip.id });
//   }

//   // Rule 3: Physical/Security to NSCDC
//   if (report.violenceType === 'Physical' || report.servicesRequested?.includes('Police/Security')) {
//     const nscdc = await Agency.findOne({ name: 'NSCDC' });
//     if (nscdc && nscdc.contactEmail && nscdc.active) agenciesToNotify.push({ email: nscdc.contactEmail, name: nscdc.name, id: nscdc.id });
//   }

//   // Rule 4: Shelter requests to partner shelters
//   if (report.servicesRequested?.includes('Shelter')) {
//     const shelters = await Agency.find({ type: 'Shelter', active: true });
//     shelters.forEach((shelter) => {
//       if (shelter.contactEmail) agenciesToNotify.push({ email: shelter.contactEmail, name: shelter.name, id: shelter.id });
//     });
//   }

//   // Deduplicate agencies (if one agency matches multiple rules)
//   const uniqueAgencies = Array.from(new Set(agenciesToNotify.map((a) => a.email))).map(
//     (email) => agenciesToNotify.find((a) => a.email === email)!
//   );

//   if (uniqueAgencies.length === 0) {
//     console.log(`No agencies determined for report ${reportId}`);
//     return;
//   }

//   // Generate PDF
//   const pdfPath = await generateIncidentPDF(report);
//   const pdfFileName = path.basename(pdfPath);
//   report.pdfPath = pdfPath;

//   // Send emails and log escalation
//   for (const agency of uniqueAgencies) {
//     const subject = `New GBV Incident Report: ${report.id}`;
//     const textBody = `A new GBV incident has been reported. Details are in the attached PDF. Report ID: ${report.id}`;
//     const htmlBody = `<p>A new GBV incident has been reported. Details are in the attached PDF.</p><p>Report ID: ${report.id}</p>`;

//     let emailStatus: 'Sent' | 'Failed' = 'Pending';
//     try {
//       await sendEmailWithAttachment(agency.email, subject, textBody, htmlBody, pdfPath, pdfFileName);
//       emailStatus = 'Sent';
//       console.log(`Email sent to ${agency.name} for report ${reportId}`);
//     } catch (emailError) {
//       emailStatus = 'Failed';
//       console.error(`Failed to send email to ${agency.name} for report ${reportId}:`, emailError);
//     }

//     await EscalationLog.create({
//       reportId: report._id,
//       agencyId: agency.id, // This assumes FCTA_DEFAULT_ID is a valid placeholder if actual agency not found
//       notifiedAt: new Date(),
//       method: 'Email',
//       status: emailStatus,
//       notes: emailStatus === 'Failed' ? 'Email sending failed' : 'Email sent successfully.'
//     });
//   }

//   report.status = 'Escalated';
//   await report.save();

//   // TODO: Trigger dashboard alert [cite: 33, 83]
//   console.log(`Report ${reportId} escalated to: ${uniqueAgencies.map((a) => a.name).join(', ')}`);
// };
