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
  UseInterceptors,
  UploadedFiles,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import * as multer from 'multer';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingFilterDto } from './dto/listing-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { StorageService } from '../storage/storage.service';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing' })
  create(
    @Body() createListingDto: CreateListingDto,
    @CurrentUser() user: any,
  ) {
    return this.listingsService.create(
      createListingDto,
      user.id,
      user.role,
    );
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get public active listings (no auth required)' })
  findPublic(@Query() filterDto: ListingFilterDto) {
    return this.listingsService.findPublic(filterDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all listings (filtered by RBAC)' })
  findAll(
    @Query() filterDto: ListingFilterDto,
    @CurrentUser() user: any,
  ) {
    return this.listingsService.findAll(filterDto, user.id, user.role);
  }

  @Get('public/:id')
  @Public()
  @UsePipes(new UuidValidationPipe())
  @ApiOperation({ summary: 'Get public listing by ID (no auth required)' })
  findOnePublic(@Param('id') id: string) {
    return this.listingsService.findOnePublic(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new UuidValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get listing by ID (filtered by RBAC)' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new UuidValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing (filtered by RBAC)' })
  update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
    @CurrentUser() user: any,
  ) {
    return this.listingsService.update(
      id,
      updateListingDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new UuidValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete listing (filtered by RBAC)' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.remove(id, user.id, user.role);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new UuidValidationPipe())
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          const error = new Error('Only image files are allowed');
          cb(error, false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload images for a listing' })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    // Upload files to Supabase Storage first
    const uploadedFiles = await Promise.all(
      files.map((file) => this.storageService.uploadFile(file))
    );

    // Pass uploaded file info to service
    return this.listingsService.addImages(id, uploadedFiles, user.id, user.role);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new UuidValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an image from a listing' })
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @CurrentUser() user: any,
  ) {
    return this.listingsService.removeImage(id, imageId, user.id, user.role);
  }
}

