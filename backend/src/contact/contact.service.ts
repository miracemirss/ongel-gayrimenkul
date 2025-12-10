import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly emailService: EmailService,
  ) {}

  async submitContactForm(createContactDto: CreateContactDto): Promise<{ success: boolean }> {
    // Basic spam protection: check honeypot field
    if (createContactDto.website && createContactDto.website.trim() !== '') {
      // Honeypot field filled - likely spam
      this.logger.warn('Spam detected: honeypot field filled');
      // Still return success to avoid revealing the honeypot
      return { success: true };
    }

    // Extract first and last name from fullName
    const nameParts = createContactDto.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      // Send email notification
      await this.emailService.sendContactFormEmail({
        fullName: createContactDto.fullName,
        email: createContactDto.email,
        phone: createContactDto.phone,
        message: createContactDto.message,
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Failed to process contact form submission', error);
      throw new BadRequestException('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }
}

