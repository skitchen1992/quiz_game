import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  AfterLoad,
} from 'typeorm';
import { Length } from 'class-validator';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', collation: 'C', nullable: false })
  @Length(10, 500, { message: 'Body must be between 10 and 500 characters.' })
  body: string;

  @Column({ type: 'jsonb', nullable: false })
  correct_answers: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  published: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;
}
