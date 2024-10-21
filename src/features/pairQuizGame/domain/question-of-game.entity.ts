import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
// {
//   "body": "What is the capital of France?",
//   "correctAnswers": ["Paris"]
// },
// {
//   "body": "Which planet is known as the Red Planet?",
//   "correctAnswers": ["Mars"]
// },
// {
//   "body": "What is the largest mammal?",
//   "correctAnswers": ["Blue whale"]
// },
// {
//   "body": "In what year did the Titanic sink?",
//   "correctAnswers": ["1912"]
// },
// {
//   "body": "What is the square root of 64?",
//   "correctAnswers": ["8"]
// },
