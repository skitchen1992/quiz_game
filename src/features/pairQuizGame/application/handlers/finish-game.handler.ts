import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import { AnswerRepository } from '@features/pairQuizGame/infrastructure/answer.repository';
import { RANDOM_QUESTIONS_COUNT } from '@utils/consts';
import { getFirstResponderPlayerId, getPlayerStatus } from '@utils/utils';

export class FinishGameCommand {
  constructor(public gameId: string) {}
}

@CommandHandler(FinishGameCommand)
export class FinishGameHandler implements ICommandHandler<FinishGameCommand> {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly answerRepository: AnswerRepository,
  ) {}
  async execute(command: FinishGameCommand): Promise<any> {
    const { gameId } = command;

    //получить игру
    const game = await this.gameRepository.getGameById(gameId);

    //получить количество ответов двух игроков
    const firstPlayerAnswersCount =
      await this.answerRepository.getAnswersCountByPlayerId(
        game!.first_player_id,
      );

    const secondPlayerAnswersCount =
      await this.answerRepository.getAnswersCountByPlayerId(
        game!.second_player_id,
      );

    //если оба игрока ответили на все вопросы завершить игру Finished
    if (
      firstPlayerAnswersCount === RANDOM_QUESTIONS_COUNT &&
      secondPlayerAnswersCount === RANDOM_QUESTIONS_COUNT
    ) {
      //Завершаем игру
      await this.gameRepository.finishGame(gameId);

      //Достаем все ответы для каждого игрока по player_id отсортированные дате
      const firstPlayerAnswers =
        await this.answerRepository.getAnswersByPlayerId(game!.first_player_id);

      const secondPlayerAnswers =
        await this.answerRepository.getAnswersByPlayerId(
          game!.second_player_id,
        );

      //Находим первого кто ответил на все вопросы
      const firstResponderPlayerId = getFirstResponderPlayerId(
        firstPlayerAnswers,
        secondPlayerAnswers,
      );

      //Есть ли у первого ответившего хоть один правильный ответ
      const hasCorrectAnswerByPlayerId =
        await this.answerRepository.hasCorrectAnswerByPlayerId(
          firstResponderPlayerId,
        );

      //Если у первого ответившего есть хоть один правильный ответ начисляем бал
      if (hasCorrectAnswerByPlayerId) {
        await this.playerRepository.incrementScore(firstResponderPlayerId);
      }

      const finishedGame = await this.gameRepository.getGameById(gameId);

      //Определяем статус первого игрока
      const firstPlayerStatus = getPlayerStatus(
        finishedGame!.first_player.score,
        finishedGame!.second_player!.score,
      );

      //Определяем статус второго игрока
      const secondPlayerStatus = getPlayerStatus(
        finishedGame!.second_player!.score,
        finishedGame!.first_player.score,
      );

      await this.playerRepository.updatePlayerStatus(
        finishedGame!.first_player_id,
        firstPlayerStatus,
      );

      await this.playerRepository.updatePlayerStatus(
        finishedGame!.second_player_id,
        secondPlayerStatus,
      );
    }
  }
}
