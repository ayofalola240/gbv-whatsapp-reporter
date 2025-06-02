// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

// Define the Config interface for type safety
interface Config {
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string | number;
  whatsappVerifyToken: string;
  whatsappAccessToken: string;
  whatsappPhoneNumberId: string;
  fctaEmail: string;
  smtpHost?: string; // Optional, as it may not be set
  smtpPort: number;
  smtpUser?: string; // Optional, as it may not be set
  smtpPass?: string; // Optional, as it may not be set
  publicUrl: string;
}

// Validate critical environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
  'WHATSAPP_VERIFY_TOKEN',
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'FCTA_EMAIL'
] as const;

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Parse and validate SMTP_PORT
const smtpPortRaw = process.env.SMTP_PORT || '587';
const smtpPort = parseInt(smtpPortRaw, 10);
if (isNaN(smtpPort)) {
  throw new Error(`Invalid SMTP_PORT: ${smtpPortRaw}. Must be a valid number.`);
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10), // Ensure number type
  mongodbUri: process.env.MONGODB_URI!, // Non-null assertion since validated
  jwtSecret: process.env.JWT_SECRET!, // Non-null assertion since validated
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN!, // Non-null assertion since validated
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN!, // Non-null assertion since validated
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!, // Non-null assertion since validated
  fctaEmail: process.env.FCTA_EMAIL!, // Non-null assertion since validated
  smtpHost: process.env.SMTP_HOST, // Optional, may be undefined
  smtpPort, // Validated number
  smtpUser: process.env.SMTP_USER, // Optional, may be undefined
  smtpPass: process.env.SMTP_PASS, // Optional, may be undefined
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000'
};
