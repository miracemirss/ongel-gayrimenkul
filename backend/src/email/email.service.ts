import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize email transporter
    // Support for SMTP or other email providers via environment variables
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPassword = this.configService.get<string>('SMTP_PASSWORD');
    const smtpSecure = this.configService.get<string>('SMTP_SECURE', 'false') === 'true';

    // Check if SMTP is properly configured
    if (!smtpHost || !smtpUser || !smtpPassword) {
      this.logger.error(
        'SMTP not configured. Email sending will fail.\n' +
        'Please set the following environment variables:\n' +
        '  - SMTP_HOST (e.g., smtp.hostinger.com)\n' +
        '  - SMTP_USER (e.g., info@ongelgayrimenkul.com)\n' +
        '  - SMTP_PASSWORD (your email password)\n' +
        '  - SMTP_PORT (optional, default: 587)\n' +
        '  - SMTP_SECURE (optional, default: false, use true for port 465)'
      );
      return; // Don't create transporter if not configured
    }

    // Validate SMTP host is not a placeholder
    if (smtpHost.includes('example.com') || smtpHost.includes('placeholder')) {
      this.logger.error(
        `SMTP_HOST is set to a placeholder value: ${smtpHost}\n` +
        'Please set SMTP_HOST to your actual SMTP server address.\n' +
        'For Hostinger: smtp.hostinger.com or smtp.titan.email'
      );
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
        // Connection timeout
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

      this.logger.log(`Email service initialized with SMTP: ${smtpHost}:${smtpPort}`);
    } catch (error) {
      this.logger.error(`Failed to initialize email transporter: ${error.message}`, error.stack);
    }
  }

  async sendContactFormEmail(data: {
    fullName: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<void> {
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized. Cannot send email.');
      throw new Error('Email service not configured');
    }

    const recipientEmail = this.configService.get<string>('CONTACT_EMAIL', 'info@ongelgayrimenkul.com');
    const submissionDate = new Date().toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #000; }
          .value { margin-top: 5px; padding: 10px; background-color: #fff; border-left: 3px solid #000; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Öngel Gayrimenkul - Yeni İletişim Formu Mesajı</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Ad Soyad:</div>
              <div class="value">${this.escapeHtml(data.fullName)}</div>
            </div>
            <div class="field">
              <div class="label">E-posta:</div>
              <div class="value">${this.escapeHtml(data.email)}</div>
            </div>
            ${data.phone ? `
            <div class="field">
              <div class="label">Telefon:</div>
              <div class="value">${this.escapeHtml(data.phone)}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Mesaj:</div>
              <div class="value">${this.escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
            </div>
            <div class="footer">
              <p><strong>Gönderim Tarihi:</strong> ${submissionDate}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Öngel Gayrimenkul - Yeni İletişim Formu Mesajı

Ad Soyad: ${data.fullName}
E-posta: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ''}

Mesaj:
${data.message}

Gönderim Tarihi: ${submissionDate}
    `;

    if (!this.transporter) {
      const errorMsg = 'Email service is not configured. Please set SMTP environment variables.';
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const smtpFrom = this.configService.get<string>('SMTP_FROM') || 
                       this.configService.get<string>('SMTP_USER') || 
                       'noreply@ongelgayrimenkul.com';
      
      // Verify connection before sending
      await this.transporter.verify();
      
      await this.transporter.sendMail({
        from: smtpFrom,
        to: recipientEmail,
        subject: '[Öngel Gayrimenkul] Yeni İletişim Formu Mesajı',
        text: textContent,
        html: htmlContent,
        replyTo: data.email, // Allow replying directly to the sender
      });

      this.logger.log(`Contact form email sent successfully to ${recipientEmail}`);
    } catch (error: any) {
      let errorMessage = 'E-posta gönderilemedi.';
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = `SMTP sunucusuna bağlanılamadı: ${error.hostname || 'bilinmeyen'}. Lütfen SMTP_HOST ayarını kontrol edin.`;
        this.logger.error(`SMTP connection error: ${error.code} - ${errorMessage}`);
      } else if (error.code === 'EAUTH') {
        errorMessage = 'SMTP kimlik doğrulama hatası. Lütfen SMTP_USER ve SMTP_PASSWORD ayarlarını kontrol edin.';
        this.logger.error(`SMTP authentication error: ${errorMessage}`);
      } else if (error.response) {
        errorMessage = `SMTP sunucu hatası: ${error.response}`;
        this.logger.error(`SMTP server error: ${error.response}`);
      } else {
        errorMessage = `E-posta gönderme hatası: ${error.message || 'Bilinmeyen hata'}`;
        this.logger.error(`Failed to send contact form email: ${error.message}`, error.stack);
      }
      
      throw new Error(errorMessage);
    }
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

