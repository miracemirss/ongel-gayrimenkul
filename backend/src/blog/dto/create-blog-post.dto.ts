import { IsString, IsEnum, IsOptional, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlogPostStatus } from '../entities/blog-post.entity';

export class CreateBlogPostDto {
  @ApiProperty({ description: 'Blog post title' })
  @IsString()
  @MinLength(3, { message: 'Başlık en az 3 karakter olmalıdır' })
  title: string;

  @ApiProperty({ description: 'URL-friendly slug (auto-generated if not provided)', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Short excerpt/summary', required: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ description: 'Full blog post content (HTML or markdown)' })
  @IsString()
  @MinLength(10, { message: 'İçerik en az 10 karakter olmalıdır' })
  content: string;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @ApiProperty({ enum: BlogPostStatus, default: BlogPostStatus.Draft })
  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;

  @ApiProperty({ description: 'Publication date (ISO string)', required: false })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @ApiProperty({ description: 'SEO title', required: false })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiProperty({ description: 'SEO description', required: false })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiProperty({ description: 'SEO keywords (comma-separated)', required: false })
  @IsString()
  @IsOptional()
  seoKeywords?: string;
}

