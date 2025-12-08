import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { CreateCmsPageDto } from './dto/create-cms-page.dto';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';
import { CmsPageType } from './entities/cms-page.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get('pages/:type')
  @ApiOperation({ summary: 'Get CMS page by type (Public)' })
  findByType(@Param('type') type: CmsPageType) {
    return this.cmsService.findByType(type);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post('pages')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create CMS page (Admin only)' })
  create(@Body() createCmsPageDto: CreateCmsPageDto) {
    return this.cmsService.create(createCmsPageDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('pages')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all CMS pages (Admin only)' })
  findAll() {
    return this.cmsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('pages/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get CMS page by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.cmsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch('pages/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update CMS page (Admin only)' })
  update(@Param('id') id: string, @Body() updateCmsPageDto: UpdateCmsPageDto) {
    return this.cmsService.update(id, updateCmsPageDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete('pages/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete CMS page (Admin only)' })
  remove(@Param('id') id: string) {
    return this.cmsService.remove(id);
  }
}

