import {
  Column,
  Entity,
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

  @Column({ name: 'game_id', type: 'uuid', nullable: false })
  game_id: string;

  @Column({ name: 'question_id', type: 'uuid', nullable: false })
  question_id: string;

  @Column({ name: 'order', type: 'int' })
  order: number;

  @OneToOne(() => QuizQuestion)
  question: QuizQuestion;

  @ManyToOne(() => Game, (game) => game.questions)
  game: Game;
}
