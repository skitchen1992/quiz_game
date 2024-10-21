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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZTgxMTk2YS03MDYxLTRjMDItYTk1ZC1iOTEzNDUxZDE3MWIiLCJpYXQiOjE3Mjk1MjUzMzMsImV4cCI6MTcyOTYxMTczM30.Xa8SivuBUqFE7SZhE5Pgr3k1w0INuQPA4nq3aOOfnzc
// 2
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MjZlNzcwZS1jZmQ5LTQ2MGYtYWVmOC02M2VhOWIzMzNiNWEiLCJpYXQiOjE3Mjk1MjQ4NDEsImV4cCI6MTcyOTYxMTI0MX0.g1akxu143tjpQFrMq6qM8Ea15SDkBnJGlnjPekCMcpI
//3
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNjg5YjFmYS1hMWFlLTQzMjgtYWZiMi04ZmE4ZjY5MDU5YWEiLCJpYXQiOjE3Mjk1MjY5NDQsImV4cCI6MTcyOTYxMzM0NH0.IijxfklIs3pY370oXH90W_KuKhOR-rDmgXHqGoOWjy4
