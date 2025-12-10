import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { BlogPost, BlogPostStatus } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    // Auto-generate slug from title if not provided
    let slug = createBlogPostDto.slug;
    if (!slug) {
      slug = this.generateSlug(createBlogPostDto.title);
    }

    // Ensure slug is unique
    slug = await this.ensureUniqueSlug(slug);

    const publishedAt = createBlogPostDto.status === BlogPostStatus.Published && !createBlogPostDto.publishedAt
      ? new Date()
      : createBlogPostDto.publishedAt ? new Date(createBlogPostDto.publishedAt) : null;

    const blogPost = this.blogPostRepository.create({
      ...createBlogPostDto,
      slug,
      publishedAt,
    });

    return this.blogPostRepository.save(blogPost);
  }

  async findAll(
    status?: BlogPostStatus,
    search?: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ posts: BlogPost[]; total: number; page: number; limit: number; totalPages: number }> {
    const where: FindOptionsWhere<BlogPost> = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Validate sortBy field
    const allowedSortFields = ['createdAt', 'updatedAt', 'publishedAt', 'title'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [posts, total] = await this.blogPostRepository.findAndCount({
      where,
      order: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findPublished(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'publishedAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    search?: string,
  ): Promise<{ posts: BlogPost[]; total: number; page: number; limit: number; totalPages: number }> {
    const where: FindOptionsWhere<BlogPost> = { status: BlogPostStatus.Published };

    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Validate sortBy field
    const allowedSortFields = ['publishedAt', 'createdAt', 'updatedAt', 'title'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'publishedAt';
    const validSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [posts, total] = await this.blogPostRepository.findAndCount({
      where,
      order: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { slug, status: BlogPostStatus.Published },
    });
    if (!post) {
      throw new NotFoundException(`Blog post with slug ${slug} not found or not published`);
    }
    return post;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await this.findOne(id);

    // Handle slug update
    if (updateBlogPostDto.title && !updateBlogPostDto.slug) {
      // Auto-generate slug from new title
      const newSlug = this.generateSlug(updateBlogPostDto.title);
      updateBlogPostDto.slug = await this.ensureUniqueSlug(newSlug, id);
    } else if (updateBlogPostDto.slug) {
      // Ensure new slug is unique
      updateBlogPostDto.slug = await this.ensureUniqueSlug(updateBlogPostDto.slug, id);
    }

    // Handle status change to published
    if (updateBlogPostDto.status === BlogPostStatus.Published && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    if (updateBlogPostDto.publishedAt) {
      post.publishedAt = new Date(updateBlogPostDto.publishedAt);
      delete updateBlogPostDto.publishedAt; // Remove from DTO to avoid type issues
    }

    Object.assign(post, updateBlogPostDto);
    return this.blogPostRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.blogPostRepository.remove(post);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const existing = await this.blogPostRepository.findOne({
        where: { slug: uniqueSlug },
      });

      if (!existing || (excludeId && existing.id === excludeId)) {
        return uniqueSlug;
      }

      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  }
}

