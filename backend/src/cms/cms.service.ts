import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsPage, CmsPageType } from './entities/cms-page.entity';
import { CreateCmsPageDto } from './dto/create-cms-page.dto';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(CmsPage)
    private cmsPagesRepository: Repository<CmsPage>,
  ) {}

  async create(createCmsPageDto: CreateCmsPageDto): Promise<CmsPage> {
    const page = this.cmsPagesRepository.create(createCmsPageDto);
    return this.cmsPagesRepository.save(page);
  }

  async findAll(): Promise<CmsPage[]> {
    return this.cmsPagesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CmsPage> {
    const page = await this.cmsPagesRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`CMS page with ID ${id} not found`);
    }
    return page;
  }

  async findByType(type: CmsPageType): Promise<CmsPage | null> {
    const page = await this.cmsPagesRepository.findOne({ where: { type } });
    // Return null if page not found (frontend will show fallback content)
    return page || null;
  }

  async update(id: string, updateCmsPageDto: UpdateCmsPageDto): Promise<CmsPage> {
    const page = await this.findOne(id);
    Object.assign(page, updateCmsPageDto);
    return this.cmsPagesRepository.save(page);
  }

  async remove(id: string): Promise<void> {
    const page = await this.findOne(id);
    await this.cmsPagesRepository.remove(page);
  }
}

