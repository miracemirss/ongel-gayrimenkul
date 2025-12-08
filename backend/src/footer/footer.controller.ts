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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FooterService } from './footer.service';
import { CreateFooterLinkDto } from './dto/create-footer-link.dto';
import { UpdateFooterLinkDto } from './dto/update-footer-link.dto';
import { FooterLinkType } from './entities/footer-link.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Footer')
@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  @Public()
  @Get('links')
  @ApiOperation({ summary: 'Get footer links (Public)' })
  findAll(@Query('type') type?: FooterLinkType) {
    return this.footerService.findAll(type);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('links/admin')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all footer links (Admin only)' })
  findAllForAdmin() {
    return this.footerService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post('links')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create footer link (Admin only)' })
  create(@Body() createFooterLinkDto: CreateFooterLinkDto) {
    return this.footerService.create(createFooterLinkDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch('links/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update footer link (Admin only)' })
  update(
    @Param('id') id: string,
    @Body() updateFooterLinkDto: UpdateFooterLinkDto,
  ) {
    return this.footerService.update(id, updateFooterLinkDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete('links/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete footer link (Admin only)' })
  remove(@Param('id') id: string) {
    return this.footerService.remove(id);
  }
}

