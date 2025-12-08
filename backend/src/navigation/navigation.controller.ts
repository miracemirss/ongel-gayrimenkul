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
import { NavigationService } from './navigation.service';
import { CreateNavItemDto } from './dto/create-nav-item.dto';
import { UpdateNavItemDto } from './dto/update-nav-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active navigation items (Public)' })
  findAll() {
    return this.navigationService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('admin')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all navigation items for admin (Admin only)' })
  findAllForAdmin() {
    return this.navigationService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create navigation item (Admin only)' })
  create(@Body() createNavItemDto: CreateNavItemDto) {
    return this.navigationService.create(createNavItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get navigation item by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.navigationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update navigation item (Admin only)' })
  update(@Param('id') id: string, @Body() updateNavItemDto: UpdateNavItemDto) {
    return this.navigationService.update(id, updateNavItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete navigation item (Admin only)' })
  remove(@Param('id') id: string) {
    return this.navigationService.remove(id);
  }
}

