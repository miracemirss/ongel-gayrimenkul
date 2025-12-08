import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FooterLinkType {
  Social = 'social',
  Portal = 'portal',
}

@Entity('footer_links')
export class FooterLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FooterLinkType,
  })
  type: FooterLinkType;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

