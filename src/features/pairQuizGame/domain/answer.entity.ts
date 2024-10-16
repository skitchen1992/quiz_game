import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from '@features/pairQuizGame/domain/player.entity';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';

export enum AnswerStatus {
  CORRECT = 'Correct',
  INCORRECT = 'Incorrect',
}
@Entity({ name: 'answer' })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'enum',
    enum: AnswerStatus,
    nullable: false,
  })
  status: AnswerStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ type: 'uuid', nullable: false })
  question_id: string;

  @ManyToOne(() => QuizQuestion)
  @JoinColumn({ name: 'question_id' })
  question: QuizQuestion;

  @Column({ type: 'uuid', nullable: false })
  player_id: string;

  @ManyToOne(() => Player, (player) => player.answers, { nullable: false })
  @JoinColumn({ name: 'player_id' })
  player: Player;
}
