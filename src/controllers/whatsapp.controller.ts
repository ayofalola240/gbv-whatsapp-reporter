import { Request, Response } from 'express';
import { processMessage } from '../services/whatsapp.service'; // You'll create this service
import { config } from '../config';

const WHATSAPP_VERIFY_TOKEN = config.whatsappVerifyToken; // Ensure this is set in your config

export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification request:', JSON.stringify(req.query, null, 2)); // For debugging

  if (mode && token) {
    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      console.log('WhatsApp Webhook verified!');
      res.status(200).send(challenge);
    } else {
      console.error('Failed validation. Make sure the validation tokens match.');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

export const handleIncomingMessage = async (req: Request, res: Response) => {
  const body = req.body;

  // Check if it's a WhatsApp notification
  if (body.object === 'whatsapp_business_account') {
    // console.log('Incoming WhatsApp message:', JSON.stringify(body, null, 2)); // For debugging

    // Process each entry (there might be multiple if batched)
    body.entry?.forEach(async (entry: any) => {
      entry.changes?.forEach(async (change: any) => {
        if (change.field === 'messages' && change.value.messages) {
          const message = change.value.messages[0];
          const from = message.from; // User's WhatsApp ID (phone number) [cite: 69]
          // const wa_id = change.value.contacts[0]?.wa_id; // This should be the same as 'from' for user messages
          // console.log(`Message from ${from}:`, message);

          // You'd pass this to a service to handle conversation flow, parsing, etc.
          await processMessage(from, message, change.value.metadata.phone_number_id);
        }
      });
    });
    res.sendStatus(200); // Acknowledge receipt
  } else {
    // Not a WhatsApp API event
    res.sendStatus(404);
  }
};
