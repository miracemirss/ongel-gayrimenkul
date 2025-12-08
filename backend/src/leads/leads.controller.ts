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
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadNoteDto } from './dto/create-lead-note.dto';
import { LeadStatus } from './entities/lead.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Leads')
@ApiBearerAuth()
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: any) {
    return this.leadsService.create(createLeadDto, user.id, user.role);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads (filtered by RBAC)' })
  findAll(
    @Query('status') status: LeadStatus,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.findAll(status, user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID (filtered by RBAC)' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead (filtered by RBAC)' })
  update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.update(id, updateLeadDto, user.id, user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead (filtered by RBAC)' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.remove(id, user.id, user.role);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add note to lead' })
  addNote(
    @Param('id') id: string,
    @Body() createNoteDto: CreateLeadNoteDto,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.addNote(id, createNoteDto, user.id, user.role);
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: 'Remove note from lead' })
  removeNote(@Param('noteId') noteId: string, @CurrentUser() user: any) {
    return this.leadsService.removeNote(noteId, user.id, user.role);
  }
}

