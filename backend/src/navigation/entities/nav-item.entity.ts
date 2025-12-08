import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NavItemType {
  Link = 'link',
  Dropdown = 'dropdown',
}

@Entity('nav_items')
export class NavItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  label: { tr: string; en: string; ar: string };

  @Column()
  href: string;

  @Column({
    type: 'enum',
    enum: NavItemType,
    default: NavItemType.Link,
  })
  type: NavItemType;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  parentId: string; // For dropdown items

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

