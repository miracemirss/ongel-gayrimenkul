import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BlogPostStatus {
  Draft = 'draft',
  Published = 'published',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  excerpt: string;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  coverImageUrl: string;

  @Column({
    type: 'enum',
    enum: BlogPostStatus,
    default: BlogPostStatus.Draft,
  })
  status: BlogPostStatus;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column('text', { nullable: true })
  seoTitle: string;

  @Column('text', { nullable: true })
  seoDescription: string;

  @Column('text', { nullable: true })
  seoKeywords: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

