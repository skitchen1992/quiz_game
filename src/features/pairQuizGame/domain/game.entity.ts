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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMzEwODY1Ni1lNTJmLTQ4YWYtOGU5NC1kZDNlZDY0MDdjNTkiLCJpYXQiOjE3MjkwMDI5MjIsImV4cCI6MTcyOTA4OTMyMn0.g1Vq1BD3TFkFFIS_43gf1PE6ECUpnhZf8X9kcwcTDqs
// 2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZTgzMjQ1Yy1jYTkxLTQ1ZmYtODc2Ni04ZmQ2MmY3OGNiMjAiLCJpYXQiOjE3MjkwMDI5MDMsImV4cCI6MTcyOTA4OTMwM30.Jgi0kxRMMetswHNudnAd468_E3pwVFdnrHDZejpJ62I
// 3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMGJlODUxMi1kYjAxLTQ5ZGMtOTA2MS0yZGFhZDZhNGZhOWYiLCJpYXQiOjE3Mjg5MzE0ODksImV4cCI6MTcyOTAxNzg4OX0.tdmPAuQaqbBFseul2-adi87741Gm_2_1ZBOHlpvFeZA//4
