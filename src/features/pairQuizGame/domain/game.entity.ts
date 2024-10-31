import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Player } from '@features/pairQuizGame/domain/player.entity';
import { QuestionOfGame } from '@features/pairQuizGame/domain/question-of-game.entity';

export enum GameStatus {
  PENDING_SECOND_PLAYER = 'PendingSecondPlayer',
  ACTIVE = 'Active',
  FINISHED = 'Finished',
}

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    nullable: false,
  })
  status: GameStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  updated_at: Date | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  started_at: Date | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  finished_at: Date | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  pending_completion_at: Date | null;

  @Column({ type: 'uuid', nullable: false })
  first_player_id: string;

  @OneToOne(() => Player, { nullable: false })
  @JoinColumn({ name: 'first_player_id' })
  first_player: Player;

  @Column({ type: 'uuid', nullable: true })
  second_player_id: string;

  @OneToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'second_player_id' })
  second_player: Player | null;

  @OneToMany(() => QuestionOfGame, (question) => question.game)
  questions: QuestionOfGame[];
}
