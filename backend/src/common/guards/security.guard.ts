import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

/**
 * Security Guard - Validates and sanitizes input to prevent SQL injection and XSS
 */
@Injectable()
export class SecurityGuard implements CanActivate {
  // SQL injection patterns
  private readonly sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
    /(\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/gi,
    /(\bAND\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/gi,
    /(--|#|\/\*|\*\/|;)/g,
    /(\bUNION\s+ALL\s+SELECT\b)/gi,
    /(\b1\s*=\s*1\b)/gi,
    /(\b1\s*=\s*'1')/gi,
  ];

  // XSS patterns
  private readonly xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const body = request.body || {};
    const query = request.query || {};
    const params = request.params || {};

    // Check all inputs
    this.validateInput(body);
    this.validateInput(query);
    this.validateInput(params);

    return true;
  }

  private validateInput(obj: any): void {
    if (!obj || typeof obj !== 'object') {
      return;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'string') {
          this.checkSqlInjection(value, key);
          this.checkXss(value, key);
        } else if (typeof value === 'object' && value !== null) {
          // Recursively check nested objects
          this.validateInput(value);
        } else if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === 'string') {
              this.checkSqlInjection(item, key);
              this.checkXss(item, key);
            } else if (typeof item === 'object') {
              this.validateInput(item);
            }
          });
        }
      }
    }
  }

  private checkSqlInjection(value: string, field: string): void {
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.test(value)) {
        throw new BadRequestException(
          `Potentially malicious input detected in field: ${field}`,
        );
      }
    }
  }

  private checkXss(value: string, field: string): void {
    for (const pattern of this.xssPatterns) {
      if (pattern.test(value)) {
        throw new BadRequestException(
          `Potentially malicious script detected in field: ${field}`,
        );
      }
    }
  }
}

