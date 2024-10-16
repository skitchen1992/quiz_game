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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZTczZDE5Ny1jYTgxLTQ3NzItODgyYy02MDU4MGMxN2E3MTciLCJpYXQiOjE3MjkwOTA4MjQsImV4cCI6MTcyOTE3NzIyNH0.pw53kxMJplg5DhaBI6HItHvvBwpDTWIFChpSi6YvQuw
// 2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmOGEwNDNiYy0wZGI4LTRmZDctOGUxNS0wZjM2ZDg0YWRjY2EiLCJpYXQiOjE3MjkwOTA4NDEsImV4cCI6MTcyOTE3NzI0MX0.UTrKmb4adki5w7KrVF28lBpaTJi-_KMYKFmXCB2QiVU
// 3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYTM2NjI0Yi0xN2YyLTRkZmQtOGY5ZC04ZDk0YjMwMGI1MWQiLCJpYXQiOjE3MjkwNjEyMDIsImV4cCI6MTcyOTE0NzYwMn0.as3OoDi_v-2B6rO0ok5AMgIp_xYxx1G4YYRtOKSDcHo
// 4
