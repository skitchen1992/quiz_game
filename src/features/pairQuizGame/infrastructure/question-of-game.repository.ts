import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionOfGame } from '@features/pairQuizGame/domain/question-of-game.entity';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { Game } from '@features/pairQuizGame/domain/game.entity';

@Injectable()
export class QuestionOfGameRepository {
  constructor(
    @InjectRepository(QuestionOfGame)
    private questionOfGameRepository: Repository<QuestionOfGame>,
  ) {}

  public async setRandomQuestion(game: Game, randomQuestions: QuizQuestion[]) {
    try {
      // Создаём объекты QuestionOfGame и связываем их с игрой
      const questionEntities = randomQuestions.map((question, index) => {
        const questionOfGame = new QuestionOfGame();

        questionOfGame.order = index + 1; // Устанавливаем порядок
        questionOfGame.question_id = question.id;
        questionOfGame.game_id = game.id;

        return questionOfGame;
      });

      // Сохраняем вопросы игры
      await this.questionOfGameRepository.save(questionEntities);
    } catch (error) {
      console.error('Error setting random questions for game', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not set random questions for game',
      );
    }
  }
}
