import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { Game } from '@features/pairQuizGame/domain/game.entity';

@Entity('question_of_game')
export class QuestionOfGame {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'order', type: 'int' })
  order: number;

  @OneToOne(() => QuizQuestion)
  @JoinColumn({ name: 'question_id' })
  question: QuizQuestion;

  @ManyToOne(() => Game, (game) => game.questions, { nullable: false })
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
