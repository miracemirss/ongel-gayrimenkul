import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListingImage } from './listing-image.entity';

export enum ListingStatus {
  ActiveForSale = 'active_for_sale',
  ActiveForRent = 'active_for_rent',
  Sold = 'sold',
  Rented = 'rented',
  Inactive = 'inactive',
}

export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  title: {
    tr: string;
    en: string;
    ar: string;
  };

  @Column('jsonb')
  description: {
    tr: string;
    en: string;
    ar: string;
  };

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.TRY,
  })
  currency: Currency;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.Inactive,
  })
  status: ListingStatus;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  longitude: number;

  @Column('decimal', { precision: 10, scale: 2 })
  netArea: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  grossArea: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  roomCount: string;

  @Column({ nullable: true })
  virtualTourUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column('uuid')
  assignedAgentId: string;

  @ManyToOne(() => User, (user) => user.listings)
  @JoinColumn({ name: 'assignedAgentId' })
  assignedAgent: User;

  @OneToMany(() => ListingImage, (image) => image.listing, { cascade: true })
  images: ListingImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

