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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjNjFkYzE5NS1kNDI1LTQxZDUtYjk5Yy0zZDg0OGRjZTEzZDAiLCJpYXQiOjE3MjkwNjExNjUsImV4cCI6MTcyOTE0NzU2NX0.n3GN5F8cmFXSJy-GxYklm1nU03MJamhb2UpbcIjxkyg
// 2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NmFmYzhjNi04MzRkLTRmZjktYjA5MC0yNzdjMjIyMDM3ZTciLCJpYXQiOjE3MjkwNjExODQsImV4cCI6MTcyOTE0NzU4NH0.hl_v5MpYPutfVtDGpIEszo0Qh28l4M0ZKsIKkDm1nIo
// 3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYTM2NjI0Yi0xN2YyLTRkZmQtOGY5ZC04ZDk0YjMwMGI1MWQiLCJpYXQiOjE3MjkwNjEyMDIsImV4cCI6MTcyOTE0NzYwMn0.as3OoDi_v-2B6rO0ok5AMgIp_xYxx1G4YYRtOKSDcHo
// 4
