import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

/**
 * Sanitize Pipe - Removes potentially dangerous characters from strings
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }
    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private sanitizeString(str: string): string {
    // Remove null bytes
    str = str.replace(/\0/g, '');
    
    // Remove control characters except newlines and tabs
    str = str.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    
    // Trim whitespace
    str = str.trim();
    
    return str;
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === 'string') {
            sanitized[key] = this.sanitizeString(value);
          } else if (typeof value === 'object') {
            sanitized[key] = this.sanitizeObject(value);
          } else {
            sanitized[key] = value;
          }
        }
      }
      return sanitized;
    }

    return obj;
  }
}

