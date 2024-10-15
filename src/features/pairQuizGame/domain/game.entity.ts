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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YmE4NzA1Mi1jMGNkLTRlZmUtYWVhNy0yNmQxZGYyMzBhNmQiLCJpYXQiOjE3Mjg5MjY5OTYsImV4cCI6MTcyOTAxMzM5Nn0.zCIMe9SWx-Ag5HCvfhviC2FPCe8wH6ZCtBSAimb8Pug
//2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTc4MzRmMi0xMWVkLTQ1NTctYjU3ZS1iNTE2YjA5NzRmMTUiLCJpYXQiOjE3Mjg5MjcwMTksImV4cCI6MTcyOTAxMzQxOX0.4631PKeNicBzANVhOf-zrs0GpRq6Hr6VzF6jSA_E1Wo
//3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMGJlODUxMi1kYjAxLTQ5ZGMtOTA2MS0yZGFhZDZhNGZhOWYiLCJpYXQiOjE3Mjg5MzE0ODksImV4cCI6MTcyOTAxNzg4OX0.tdmPAuQaqbBFseul2-adi87741Gm_2_1ZBOHlpvFeZA//4
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYTlmYWFlOS1lZTE3LTQxZTctYjM1Ni0xOGUzYmQ5YWM0YTMiLCJpYXQiOjE3Mjg4MzE5ODksImV4cCI6MTcyODkxODM4OX0.mW2RFyyytgN1HXKmWDYsmbdUGjJUQtdAyNoelWBNuJU
