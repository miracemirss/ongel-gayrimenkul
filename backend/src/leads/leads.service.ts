import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Lead, LeadStatus } from './entities/lead.entity';
import { LeadNote } from './entities/lead-note.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadNoteDto } from './dto/create-lead-note.dto';
import { Role } from '../common/decorators/roles.decorator';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    @InjectRepository(LeadNote)
    private leadNotesRepository: Repository<LeadNote>,
  ) {}

  async create(
    createLeadDto: CreateLeadDto,
    userId: string,
    userRole: Role,
  ): Promise<Lead> {
    // Agent can only assign leads to themselves
    if (userRole === Role.Agent) {
      createLeadDto.assignedAgentId = userId;
    }

    const lead = this.leadsRepository.create(createLeadDto);
    return this.leadsRepository.save(lead);
  }

  async findAll(
    status?: LeadStatus,
    userId?: string,
    userRole?: Role,
  ): Promise<Lead[]> {
    const where: FindOptionsWhere<Lead> = {};

    // Agent can only see their own leads
    if (userRole === Role.Agent) {
      where.assignedAgentId = userId;
    }

    if (status) {
      where.status = status;
    }

    return this.leadsRepository.find({
      where,
      relations: ['assignedAgent', 'notes', 'notes.createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(
    id: string,
    userId: string,
    userRole: Role,
  ): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({
      where: { id },
      relations: ['assignedAgent', 'notes', 'notes.createdBy'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // RBAC: Agent can only access their own leads
    if (userRole === Role.Agent && lead.assignedAgentId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this lead',
      );
    }

    return lead;
  }

  async update(
    id: string,
    updateLeadDto: UpdateLeadDto,
    userId: string,
    userRole: Role,
  ): Promise<Lead> {
    const lead = await this.findOne(id, userId, userRole);

    // Agent can only update their own leads
    if (userRole === Role.Agent && lead.assignedAgentId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this lead',
      );
    }

    // Agent cannot change assignedAgentId
    if (userRole === Role.Agent && updateLeadDto.assignedAgentId) {
      delete updateLeadDto.assignedAgentId;
    }

    Object.assign(lead, updateLeadDto);
    return this.leadsRepository.save(lead);
  }

  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const lead = await this.findOne(id, userId, userRole);

    // Agent can only delete their own leads
    if (userRole === Role.Agent && lead.assignedAgentId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this lead',
      );
    }

    await this.leadsRepository.remove(lead);
  }

  async addNote(
    leadId: string,
    createNoteDto: CreateLeadNoteDto,
    userId: string,
    userRole: Role,
  ): Promise<LeadNote> {
    const lead = await this.findOne(leadId, userId, userRole);

    const note = this.leadNotesRepository.create({
      ...createNoteDto,
      leadId: lead.id,
      createdById: userId,
    });

    return this.leadNotesRepository.save(note);
  }

  async removeNote(
    noteId: string,
    userId: string,
    userRole: Role,
  ): Promise<void> {
    const note = await this.leadNotesRepository.findOne({
      where: { id: noteId },
      relations: ['lead'],
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    // Check if user has access to the lead
    await this.findOne(note.lead.id, userId, userRole);

    await this.leadNotesRepository.remove(note);
  }
}

