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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YmE4NzA1Mi1jMGNkLTRlZmUtYWVhNy0yNmQxZGYyMzBhNmQiLCJpYXQiOjE3Mjg4Mjk4NjIsImV4cCI6MTcyODkxNjI2Mn0._u4FM85BP3-hKzsLzHv1zPV8nALMyptPoqeE_NB8rSU

//2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTc4MzRmMi0xMWVkLTQ1NTctYjU3ZS1iNTE2YjA5NzRmMTUiLCJpYXQiOjE3Mjg4Mjk4NDIsImV4cCI6MTcyODkxNjI0Mn0.fx7_aChdXt9NqkCL1eVNYk3C6tX2AXFDAc-aGQ1rpYw

//3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMGJlODUxMi1kYjAxLTQ5ZGMtOTA2MS0yZGFhZDZhNGZhOWYiLCJpYXQiOjE3Mjg4Mjk4MjEsImV4cCI6MTcyODkxNjIyMX0.Jpj9LquB4paQHBtbxldByKMl-yvCHjnIKt5JUiqT5mc
//4
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYTlmYWFlOS1lZTE3LTQxZTctYjM1Ni0xOGUzYmQ5YWM0YTMiLCJpYXQiOjE3Mjg4MzE5ODksImV4cCI6MTcyODkxODM4OX0.mW2RFyyytgN1HXKmWDYsmbdUGjJUQtdAyNoelWBNuJU
