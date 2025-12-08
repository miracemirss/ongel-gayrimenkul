import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Listing, ListingStatus } from './entities/listing.entity';
import { ListingImage } from './entities/listing-image.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingFilterDto } from './dto/listing-filter.dto';
import { Role } from '../common/decorators/roles.decorator';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(ListingImage)
    private listingImagesRepository: Repository<ListingImage>,
    private storageService: StorageService,
  ) {}

  async create(
    createListingDto: CreateListingDto,
    userId: string,
    userRole: Role,
  ): Promise<Listing> {
    // Agent can only assign listings to themselves
    if (userRole === Role.Agent) {
      createListingDto.assignedAgentId = userId;
    }

    // Convert empty strings to null for optional URL fields
    if (createListingDto.virtualTourUrl === '' || createListingDto.virtualTourUrl === null) {
      createListingDto.virtualTourUrl = null;
    }
    if (createListingDto.videoUrl === '' || createListingDto.videoUrl === null) {
      createListingDto.videoUrl = null;
    }

    const listing = this.listingsRepository.create(createListingDto);
    return this.listingsRepository.save(listing);
  }

  async findPublic(filterDto: ListingFilterDto): Promise<{ data: Listing[]; total: number; page: number; limit: number; totalPages: number }> {
    // Only return active listings (for sale or rent)
    const queryBuilder = this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.images', 'images')
      .where('listing.status IN (:...statuses)', {
        statuses: [ListingStatus.ActiveForSale, ListingStatus.ActiveForRent],
      });

    if (filterDto.currency) {
      queryBuilder.andWhere('listing.currency = :currency', {
        currency: filterDto.currency,
      });
    }
    if (filterDto.location) {
      queryBuilder.andWhere('listing.location ILIKE :location', {
        location: `%${filterDto.location}%`,
      });
    }
    if (filterDto.roomCount) {
      queryBuilder.andWhere('listing.roomCount ILIKE :roomCount', {
        roomCount: `%${filterDto.roomCount}%`,
      });
    }
    if (filterDto.minPrice) {
      queryBuilder.andWhere('listing.price >= :minPrice', {
        minPrice: filterDto.minPrice,
      });
    }
    if (filterDto.maxPrice) {
      queryBuilder.andWhere('listing.price <= :maxPrice', {
        maxPrice: filterDto.maxPrice,
      });
    }
    if (filterDto.minArea) {
      queryBuilder.andWhere('listing.netArea >= :minArea', {
        minArea: filterDto.minArea,
      });
    }
    if (filterDto.maxArea) {
      queryBuilder.andWhere('listing.netArea <= :maxArea', {
        maxArea: filterDto.maxArea,
      });
    }

    // Sorting - Whitelist validation to prevent SQL injection
    const allowedSortFields = ['price', 'createdAt', 'netArea', 'location'];
    const sortBy = allowedSortFields.includes(filterDto.sortBy || 'createdAt') 
      ? filterDto.sortBy || 'createdAt' 
      : 'createdAt';
    const sortOrder = (filterDto.sortOrder === 'ASC' || filterDto.sortOrder === 'DESC') 
      ? filterDto.sortOrder 
      : 'DESC';
    queryBuilder.orderBy(`listing.${sortBy}`, sortOrder);

    // Pagination
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 12;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOnePublic(id: string): Promise<Listing> {
    const listing = await this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.images', 'images')
      .where('listing.id = :id', { id })
      .andWhere('listing.status IN (:...statuses)', {
        statuses: [ListingStatus.ActiveForSale, ListingStatus.ActiveForRent],
      })
      .getOne();

    if (!listing) {
      throw new NotFoundException(`Active listing with ID ${id} not found`);
    }

    return listing;
  }

  async findAll(
    filterDto: ListingFilterDto,
    userId: string,
    userRole: Role,
  ): Promise<{ data: Listing[]; total: number; page: number; limit: number; totalPages: number }> {
    const where: FindOptionsWhere<Listing> = {};

    // Agent can only see their own listings
    if (userRole === Role.Agent) {
      where.assignedAgentId = userId;
    }

    // Apply filters
    if (filterDto.status) {
      where.status = filterDto.status;
    }
    if (filterDto.currency) {
      where.currency = filterDto.currency;
    }
    if (filterDto.location) {
      where.location = filterDto.location;
    }
    if (filterDto.roomCount) {
      where.roomCount = filterDto.roomCount;
    }

    const queryBuilder = this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.images', 'images')
      .leftJoinAndSelect('listing.assignedAgent', 'agent')
      .where(where);

    if (filterDto.minPrice) {
      queryBuilder.andWhere('listing.price >= :minPrice', {
        minPrice: filterDto.minPrice,
      });
    }
    if (filterDto.maxPrice) {
      queryBuilder.andWhere('listing.price <= :maxPrice', {
        maxPrice: filterDto.maxPrice,
      });
    }
    if (filterDto.minArea) {
      queryBuilder.andWhere('listing.netArea >= :minArea', {
        minArea: filterDto.minArea,
      });
    }
    if (filterDto.maxArea) {
      queryBuilder.andWhere('listing.netArea <= :maxArea', {
        maxArea: filterDto.maxArea,
      });
    }

    // Sorting - Whitelist validation to prevent SQL injection
    const allowedSortFields = ['price', 'createdAt', 'netArea', 'location'];
    const sortBy = allowedSortFields.includes(filterDto.sortBy || 'createdAt') 
      ? filterDto.sortBy || 'createdAt' 
      : 'createdAt';
    const sortOrder = (filterDto.sortOrder === 'ASC' || filterDto.sortOrder === 'DESC') 
      ? filterDto.sortOrder 
      : 'DESC';
    queryBuilder.orderBy(`listing.${sortBy}`, sortOrder);

    // Pagination
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 12;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(
    id: string,
    userId: string,
    userRole: Role,
  ): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['images', 'assignedAgent'],
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    // RBAC: Agent can only access their own listings
    if (userRole === Role.Agent && listing.assignedAgentId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this listing',
      );
    }

    return listing;
  }

  async update(
    id: string,
    updateListingDto: UpdateListingDto,
    userId: string,
    userRole: Role,
  ): Promise<Listing> {
    const listing = await this.findOne(id, userId, userRole);

    // Agent can only update their own listings
    if (userRole === Role.Agent && listing.assignedAgentId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this listing',
      );
    }

    // Agent cannot change assignedAgentId
    if (userRole === Role.Agent && updateListingDto.assignedAgentId) {
      delete updateListingDto.assignedAgentId;
    }

    // Convert empty strings to null for optional URL fields (null will update the field, undefined won't)
    if (updateListingDto.virtualTourUrl === '' || updateListingDto.virtualTourUrl === null) {
      updateListingDto.virtualTourUrl = null;
    }
    if (updateListingDto.videoUrl === '' || updateListingDto.videoUrl === null) {
      updateListingDto.videoUrl = null;
    }

    Object.assign(listing, updateListingDto);
    return this.listingsRepository.save(listing);
  }

  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const listing = await this.findOne(id, userId, userRole);

    // Agent can only delete their own listings
    if (userRole === Role.Agent && listing.assignedAgentId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this listing',
      );
    }

    await this.listingsRepository.remove(listing);
  }

  async addImages(
    listingId: string,
    uploadedFiles: Array<{ url: string; key: string }>,
    userId: string,
    userRole: Role,
  ): Promise<ListingImage[]> {
    // Verify listing exists and user has permission
    const listing = await this.findOne(listingId, userId, userRole);

    // Get current max order
    const existingImages = await this.listingImagesRepository.find({
      where: { listingId },
      order: { order: 'DESC' },
    });
    let nextOrder = existingImages.length > 0 ? existingImages[0].order + 1 : 0;

    // Create image records from uploaded files
    const images = uploadedFiles.map((file) => {
      const image = this.listingImagesRepository.create({
        listingId: listing.id,
        url: file.url,
        key: file.key,
        order: nextOrder++,
      });
      return image;
    });

    return this.listingImagesRepository.save(images);
  }

  async removeImage(
    listingId: string,
    imageId: string,
    userId: string,
    userRole: Role,
  ): Promise<void> {
    // Verify listing exists and user has permission
    const listing = await this.findOne(listingId, userId, userRole);

    // Find the image
    const image = await this.listingImagesRepository.findOne({
      where: { id: imageId, listingId: listing.id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    // Delete from Supabase Storage (if key exists)
    if (image.key) {
      try {
        await this.storageService.deleteFile(image.key);
      } catch (error) {
        console.error('Error deleting file from Supabase Storage:', error);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    await this.listingImagesRepository.remove(image);
  }
}

