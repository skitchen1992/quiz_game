import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@features/users/domain/user.entity';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { Answer } from '@features/pairQuizGame/domain/answer.entity';

@Entity({ name: 'player' })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.player)
  user: User;

  @Column({ type: 'uuid', nullable: false })
  user_id: boolean;

  @Column({ type: 'int', default: 0 })
  score: number;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Game, (game) => game.id)
  game: Game;

  @OneToMany(() => Answer, (answer) => answer.player)
  answers: Answer[];
}
