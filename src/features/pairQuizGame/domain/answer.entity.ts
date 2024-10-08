import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameStatus } from '@features/pairQuizGame/domain/game.entity';
import { Player } from '@features/pairQuizGame/domain/player.entity';

export enum AnswerStatus {
  CORRECT = 'Correct',
  INCORRECT = 'Incorrect',
}
@Entity({ name: 'answer' })
export class Answer {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({
    type: 'enum',
    enum: AnswerStatus,
    nullable: false,
  })
  status: GameStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ type: 'uuid', nullable: false })
  questionId: string;

  @ManyToOne(() => Player, (player) => player.answers)
  player: Player;
}
