// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';
// import { IIncidentReport } from '../../models/incidentReport.model';

// export const generateIncidentPDF = async (report: IIncidentReport): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ margin: 50 });
//     const filePath = path.join(__dirname, `../../../reports_pdf/incident_${report.id}.pdf`); // Ensure this dir exists
//     const stream = fs.createWriteStream(filePath);

//     doc.pipe(stream);

//     // PDF Content Generation
//     doc.fontSize(18).text(`Incident Report: ${report.id}`, { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(12).text(`Status: ${report.status}`);
//     doc.text(`Date Reported: ${report.createdAt.toDateString()}`);
//     doc.moveDown();

//     doc.text(`Violence Type: ${report.violenceType}`);
//     doc.text(`Incident Date: ${new Date(report.incidentDate).toLocaleDateString()}`);
//     doc.text(`Location: ${report.location}`);
//     doc.moveDown();

//     doc.text('Description:', { underline: true });
//     doc.text(report.description || 'N/A');
//     doc.moveDown();

//     if (report.victimName && report.victimName !== 'Anonymous') {
//       doc.text(`Victim Name: ${report.victimName}`);
//     } else {
//       doc.text(`Victim: Anonymous`);
//     }
//     if (report.victimAge) doc.text(`Victim Age: ${report.victimAge}`);
//     if (report.victimGender) doc.text(`Victim Gender: ${report.victimGender}`);
//     doc.moveDown();

//     if (report.reporterName) doc.text(`Reporter Name: ${report.reporterName}`);
//     if (report.reporterPhone) doc.text(`Reporter Phone: ${report.reporterPhone}`);
//     doc.moveDown();

//     doc.text('Services Requested:', { underline: true });
//     doc.text(report.servicesRequested?.join(', ') || 'None');
//     doc.moveDown();

//     // TODO: Add image embedding if mediaFiles exist and are images

//     doc.end();

//     stream.on('finish', () => {
//       resolve(filePath);
//     });
//     stream.on('error', (err) => {
//       reject(err);
//     });
//   });
// };
