// src/config/index.ts
// Ensure you have this file or manage config directly in app.ts/server.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gbv_reporter',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'your_whatsapp_verify_token',
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'your_whatsapp_cloud_api_access_token',
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'your_whatsapp_phone_number_id',
  fctaEmail: process.env.FCTA_EMAIL || 'womensaffairs@fcta.gov.ng',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS
};
