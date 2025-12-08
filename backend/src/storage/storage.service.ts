import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient | null = null;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.bucketName = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'listings';

    if (supabaseUrl && supabaseServiceKey) {
      this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      console.log('Supabase Storage initialized successfully');
    } else {
      console.warn('Supabase Storage configuration missing. Using memory storage as fallback.');
      console.warn('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
    }
  }

  getMulterStorage(): MulterOptions {
    // Use memory storage - we'll upload to Supabase in the service
    return {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          const error = new Error('Only image files are allowed');
          cb(error as any, false);
        }
      },
    };
  }

  private sanitizeFileName(fileName: string): string {
    // Remove or replace invalid characters for Supabase Storage
    // Supabase Storage keys can only contain: letters, numbers, spaces, and these characters: -_./!
    
    // Get file extension
    const lastDot = fileName.lastIndexOf('.');
    const extension = lastDot > 0 ? fileName.substring(lastDot) : '';
    const nameWithoutExt = lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
    
    // Normalize Turkish characters and remove accents
    const normalized = nameWithoutExt
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C');
    
    // Replace spaces and invalid characters with underscore
    const sanitized = normalized
      .replace(/[^a-zA-Z0-9\-_./!]/g, '_') // Replace invalid chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
    
    return sanitized + extension;
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; key: string }> {
    if (!this.supabase) {
      throw new Error('Supabase Storage is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedFileName = this.sanitizeFileName(file.originalname);
    const filename = `listings/${uniqueSuffix}-${sanitizedFileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Failed to upload file to Supabase Storage: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filename);

    return {
      url: urlData.publicUrl,
      key: filename,
    };
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.supabase) {
      console.warn('Supabase Storage is not configured. Cannot delete file.');
      return;
    }

    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([key]);

      if (error) {
        console.error('Error deleting file from Supabase Storage:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting file from Supabase Storage:', error);
      throw error;
    }
  }

  getFileUrl(key: string): string {
    if (!this.supabase) {
      return '';
    }

    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(key);

    return data.publicUrl;
  }
}

