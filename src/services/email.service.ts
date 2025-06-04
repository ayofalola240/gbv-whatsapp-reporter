import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import pug from 'pug';
import path from 'path';
import { convert } from 'html-to-text';
// import { handleReceiptAndUpload } from '../utils/generateReceiptPDF';

interface User {
  email: string;
  firstName: string;
}

export class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private data: any;
  private from: string;

  constructor(user: User, data: any, url: string) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.data = data;
    this.from = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;
  }

  private newTransport(): Transporter {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!, 10),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  private async send(template: string, subject: string, pdfBuffer?: Buffer): Promise<void> {
    const context: { [key: string]: any } = {
      firstName: this.firstName,
      url: this.url,
      subject
    };

    // Merge additional data if available
    if (typeof this.data === 'object' && this.data !== null) {
      Object.assign(context, this.data);
    }

    // Render HTML using Pug
    const html = pug.renderFile(path.join(__dirname, `/../views/email/${template}.pug`), context);
    const mailOptions: any = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

    // Attach the PDF buffer if provided
    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `receipt_${this.data.paymentReference}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ];
    }

    // Send the email
    try {
      const response: SentMessageInfo = await this.newTransport().sendMail(mailOptions);
      console.log(`Email sent: ${response.messageId}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  public async sendWelcome(): Promise<void> {
    await this.send('welcome', 'BDF User Registration');
  }

  public async sendBidWinnerNotification(): Promise<void> {
    await this.send('winAuctionEmail', 'Your Auction Notification');
  }
}
