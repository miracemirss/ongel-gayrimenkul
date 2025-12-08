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
import { LeadNote } from './lead-note.entity';

export enum LeadSource {
  ContactForm = 'contact_form',
  PortfolioInquiry = 'portfolio_inquiry',
  MortgageApplication = 'mortgage_application',
}

export enum LeadStatus {
  New = 'new',
  InProgress = 'in_progress',
  Completed = 'completed',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: LeadSource,
  })
  source: LeadSource;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.New,
  })
  status: LeadStatus;

  @Column('uuid', { nullable: true })
  relatedListingId: string;

  @Column('uuid', { nullable: true })
  assignedAgentId: string;

  @ManyToOne(() => User, (user) => user.leads)
  @JoinColumn({ name: 'assignedAgentId' })
  assignedAgent: User;

  @OneToMany(() => LeadNote, (note) => note.lead, { cascade: true })
  notes: LeadNote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

