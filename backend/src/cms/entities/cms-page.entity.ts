import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CmsPageType {
  About = 'about',
  Services = 'services',
  Mortgage = 'mortgage',
}

@Entity('cms_pages')
export class CmsPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CmsPageType,
    unique: true,
  })
  type: CmsPageType;

  @Column('jsonb')
  title: {
    tr: string;
    en: string;
    ar: string;
  };

  @Column('jsonb')
  content: {
    tr: string;
    en: string;
    ar: string;
  };

  @Column('jsonb', { nullable: true })
  metaTitle: {
    tr?: string;
    en?: string;
    ar?: string;
  };

  @Column('jsonb', { nullable: true })
  metaDescription: {
    tr?: string;
    en?: string;
    ar?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

