import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NavItem } from './entities/nav-item.entity';
import { CreateNavItemDto } from './dto/create-nav-item.dto';
import { UpdateNavItemDto } from './dto/update-nav-item.dto';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(NavItem)
    private navItemsRepository: Repository<NavItem>,
  ) {}

  async create(createNavItemDto: CreateNavItemDto): Promise<NavItem> {
    const item = this.navItemsRepository.create(createNavItemDto);
    return this.navItemsRepository.save(item);
  }

  async findAll(): Promise<NavItem[]> {
    return this.navItemsRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  async findAllForAdmin(): Promise<NavItem[]> {
    return this.navItemsRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<NavItem> {
    const item = await this.navItemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Navigation item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateNavItemDto: UpdateNavItemDto): Promise<NavItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateNavItemDto);
    return this.navItemsRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.navItemsRepository.remove(item);
  }
}

