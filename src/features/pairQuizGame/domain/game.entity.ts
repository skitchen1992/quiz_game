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

  // @Column({
  //   type: 'timestamptz',
  //   nullable: true,
  // })
  // pair_created_at: Date | null;

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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0OTc4MWZlOC1iY2RkLTQ1MzEtOGU2Zi1mMTg0ZDRkYzIyYmIiLCJpYXQiOjE3MjkwNjI1OTUsImV4cCI6MTcyOTE0ODk5NX0._MQitxRoBu6j0fCqqTK8SQWMZScv1a56mO-9Nz9vyZQ
// 2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyOTIwYTVmMi1kZTJjLTQ2NGMtODBhNC0yMmVmZGQzMmU5ODEiLCJpYXQiOjE3MjkwNjI2MTMsImV4cCI6MTcyOTE0OTAxM30.eF_nm8LzYfl9yE1CcRUGOmZUyjH9yPEgHYj1PTK2S7U
// 3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYTM2NjI0Yi0xN2YyLTRkZmQtOGY5ZC04ZDk0YjMwMGI1MWQiLCJpYXQiOjE3MjkwNjEyMDIsImV4cCI6MTcyOTE0NzYwMn0.as3OoDi_v-2B6rO0ok5AMgIp_xYxx1G4YYRtOKSDcHo
// 4
