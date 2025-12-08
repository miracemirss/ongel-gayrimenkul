import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FooterLink, FooterLinkType } from './entities/footer-link.entity';
import { CreateFooterLinkDto } from './dto/create-footer-link.dto';
import { UpdateFooterLinkDto } from './dto/update-footer-link.dto';

@Injectable()
export class FooterService {
  constructor(
    @InjectRepository(FooterLink)
    private footerLinksRepository: Repository<FooterLink>,
  ) {}

  async create(createFooterLinkDto: CreateFooterLinkDto): Promise<FooterLink> {
    const link = this.footerLinksRepository.create(createFooterLinkDto);
    return this.footerLinksRepository.save(link);
  }

  async findAll(type?: FooterLinkType): Promise<FooterLink[]> {
    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }
    return this.footerLinksRepository.find({
      where,
      order: { order: 'ASC' },
    });
  }

  async findAllForAdmin(): Promise<FooterLink[]> {
    return this.footerLinksRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FooterLink> {
    const link = await this.footerLinksRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Footer link with ID ${id} not found`);
    }
    return link;
  }

  async update(id: string, updateFooterLinkDto: UpdateFooterLinkDto): Promise<FooterLink> {
    const link = await this.findOne(id);
    Object.assign(link, updateFooterLinkDto);
    return this.footerLinksRepository.save(link);
  }

  async remove(id: string): Promise<void> {
    const link = await this.findOne(id);
    await this.footerLinksRepository.remove(link);
  }
}

