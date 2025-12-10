import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPostStatus } from './entities/blog-post.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get published blog posts (Public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String, enum: ['publishedAt', 'createdAt', 'updatedAt', 'title'] })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  findPublished(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    return this.blogService.findPublished(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      sortBy || 'publishedAt',
      sortOrder || 'DESC',
      search,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('admin/all')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all blog posts with filters (Admin only)' })
  @ApiQuery({ name: 'status', required: false, enum: BlogPostStatus })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String, enum: ['createdAt', 'updatedAt', 'publishedAt', 'title'] })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['ASC', 'DESC'] })
  findAll(
    @Query('status') status?: BlogPostStatus,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.blogService.findAll(
      status,
      search,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      sortBy || 'createdAt',
      sortOrder || 'DESC',
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('admin/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get blog post by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create new blog post (Admin only)' })
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch('admin/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update blog post (Admin only)' })
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.update(id, updateBlogPostDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete('admin/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete blog post (Admin only)' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get published blog post by slug (Public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
}

