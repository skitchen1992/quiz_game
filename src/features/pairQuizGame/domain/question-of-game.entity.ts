import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { Game } from '@features/pairQuizGame/domain/game.entity';

@Entity('question_of_game')
@Unique(['question_id']) // Уникальное ограничение для question_id
export class QuestionOfGame {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'order', type: 'int' })
  order: number;

  @Column({ type: 'uuid', nullable: false })
  question_id: string;

  @ManyToOne(() => QuizQuestion)
  @JoinColumn({ name: 'question_id' })
  question: QuizQuestion;

  @Column({ type: 'uuid', nullable: false })
  game_id: string;

  @ManyToOne(() => Game, (game) => game.questions, { nullable: false })
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
