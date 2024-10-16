import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@features/users/domain/user.entity';
import { Answer } from '@features/pairQuizGame/domain/answer.entity';

export enum PlayerStatus {
  WIN = 'win',
  LOSS = 'loss',
  DRAW = 'draw',
  IN_PROGRESS = 'in_progress',
}

@Entity({ name: 'player' })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => User, (user) => user.player)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', default: 0 })
  score: number;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToMany(() => Answer, (answer) => answer.player)
  answers: Answer[];

  @Column({
    type: 'enum',
    enum: PlayerStatus,
    default: PlayerStatus.IN_PROGRESS,
  })
  status: PlayerStatus;
}
