import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

/**
 * UUID Validation Pipe - Validates that ID parameters are valid UUIDs
 */
@Injectable()
export class UuidValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param' && metadata.data === 'id') {
      if (!isUUID(value)) {
        throw new BadRequestException('Invalid UUID format');
      }
    }
    return value;
  }
}

