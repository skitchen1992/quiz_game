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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5N2YyZjIyNC1kZjdkLTQ1OWEtOTA3Yi00MTdmNTkzOGYxODkiLCJpYXQiOjE3MjkwOTM0NjMsImV4cCI6MTcyOTE3OTg2M30.QNKKgIiBt6kPs63mgXI3_Fzx5II8dJND0nThHxAN7qs
// 2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NzI3ODBmNS0xYzRjLTRiNDUtYWNmNy1lNmJiZWI0MDNmZDQiLCJpYXQiOjE3MjkwOTM0NDksImV4cCI6MTcyOTE3OTg0OX0.uOLS6W_3eXB9T12BN-G-vieptZxf_xoVRAmf5LjxXpY
// 3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYTM2NjI0Yi0xN2YyLTRkZmQtOGY5ZC04ZDk0YjMwMGI1MWQiLCJpYXQiOjE3MjkwNjEyMDIsImV4cCI6MTcyOTE0NzYwMn0.as3OoDi_v-2B6rO0ok5AMgIp_xYxx1G4YYRtOKSDcHo
// 4
