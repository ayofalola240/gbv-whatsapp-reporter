// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: parseInt(process.env.SMTP_PORT || '587') === 465, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// export const sendEmailWithAttachment = async (
//   to: string | string[],
//   subject: string,
//   textBody: string,
//   htmlBody: string,
//   attachmentPath: string,
//   filename: string
// ) => {
//   const mailOptions = {
//     from: `"GBV Reporting System" <${process.env.SMTP_USER}>`,
//     to: Array.isArray(to) ? to.join(',') : to,
//     subject: subject, // [cite: 29]
//     text: textBody,
//     html: htmlBody,
//     attachments: [
//       // [cite: 28]
//       {
//         filename: filename,
//         path: attachmentPath,
//         contentType: 'application/pdf'
//       }
//     ]
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };
