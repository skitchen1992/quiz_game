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
  pair_created_at: Date | null;

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

//1
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YmE4NzA1Mi1jMGNkLTRlZmUtYWVhNy0yNmQxZGYyMzBhNmQiLCJpYXQiOjE3Mjg3MzEwMzAsImV4cCI6MTcyODgxNzQzMH0.sWMlCNueNwxHttb2qi0KDC2RTanlzu5h5CxcRK96S-M

//2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTc4MzRmMi0xMWVkLTQ1NTctYjU3ZS1iNTE2YjA5NzRmMTUiLCJpYXQiOjE3Mjg3MzEwNjQsImV4cCI6MTcyODgxNzQ2NH0.32O4mPpUW4mKUpCjEdIYmIJ9FihuG82bgzu8WV4ljRI

//3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMGJlODUxMi1kYjAxLTQ5ZGMtOTA2MS0yZGFhZDZhNGZhOWYiLCJpYXQiOjE3Mjg3NDI5MDgsImV4cCI6MTcyODgyOTMwOH0.YeSt6J_ATVwfEuX5e4Iw-3TMF2p9DfggX1U_NRHWjrA
