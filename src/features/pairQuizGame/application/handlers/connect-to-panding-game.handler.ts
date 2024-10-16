import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Player } from '@features/pairQuizGame/domain/player.entity';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import { QuestionOfGameRepository } from '@features/pairQuizGame/infrastructure/question-of-game.repository';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';
import { RANDOM_QUESTIONS_COUNT } from '@utils/consts';

export class ConnectToPendingGameCommand {
  constructor(
    public game: Game,
    public player: Player,
  ) {}
}

@CommandHandler(ConnectToPendingGameCommand)
export class ConnectToPendingGameHandler
  implements ICommandHandler<ConnectToPendingGameCommand, Game>
{
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly questionOfGameRepository: QuestionOfGameRepository,
    private readonly quizQuestionsRepository: QuizQuestionsRepository,
  ) {}
  async execute(command: ConnectToPendingGameCommand): Promise<Game> {
    const { game, player } = command;

    // Получаем случайные вопросы
    const randomQuestions =
      await this.quizQuestionsRepository.getRandomQuestions(
        RANDOM_QUESTIONS_COUNT,
      );

    // Устанавливаем случайные вопросы для текущей игры
    await this.questionOfGameRepository.setRandomQuestion(
      game,
      randomQuestions,
    );

    return await this.gameRepository.connectSecondPlayerToGame(game, player);
  }
}
