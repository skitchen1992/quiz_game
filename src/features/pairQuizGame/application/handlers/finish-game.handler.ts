import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import { AnswerRepository } from '@features/pairQuizGame/infrastructure/answer.repository';
import { ANSWER_TIMEOUT_MS, RANDOM_QUESTIONS_COUNT } from '@utils/consts';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { Answer } from '@features/pairQuizGame/domain/answer.entity';
import { PlayerStatus } from '@features/pairQuizGame/domain/player.entity';

export class FinishGameCommand {
  constructor(public gameId: string) {}
}

@CommandHandler(FinishGameCommand)
export class FinishGameHandler implements ICommandHandler<FinishGameCommand> {
  private readonly logger = new Logger(FinishGameHandler.name);

  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly answerRepository: AnswerRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  private async getFirstResponderPlayerId(
    firstPlayerAnswers: Answer[],
    secondPlayerAnswers: Answer[],
  ) {
    const firstPlayerLastAnswerDate = firstPlayerAnswers.at(-1);
    const secondPlayerLastAnswerDate = secondPlayerAnswers.at(-1);

    if (firstPlayerLastAnswerDate && secondPlayerLastAnswerDate) {
      return firstPlayerLastAnswerDate.created_at <
        secondPlayerLastAnswerDate.created_at
        ? firstPlayerLastAnswerDate.player_id
        : secondPlayerLastAnswerDate.player_id;
    }

    if (firstPlayerLastAnswerDate && !secondPlayerLastAnswerDate) {
      return firstPlayerLastAnswerDate.player_id;
    }

    if (!firstPlayerLastAnswerDate && secondPlayerLastAnswerDate) {
      return secondPlayerLastAnswerDate.player_id;
    }

    return null;
  }

  private async getPlayerStatus(
    firstPlayerScore: number,
    secondPlayerScore: number,
  ) {
    if (firstPlayerScore > secondPlayerScore) {
      return PlayerStatus.WIN;
    }

    if (firstPlayerScore < secondPlayerScore) {
      return PlayerStatus.LOSS;
    }

    return PlayerStatus.DRAW;
  }

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
      const firstResponderPlayerId = await this.getFirstResponderPlayerId(
        firstPlayerAnswers,
        secondPlayerAnswers,
      );

      //Есть ли у первого ответившего хоть один правильный ответ
      const hasCorrectAnswerByPlayerId =
        await this.answerRepository.hasCorrectAnswerByPlayerId(
          firstResponderPlayerId!,
        );

      const player = await this.playerRepository.getPlayerById(
        firstResponderPlayerId!,
      );

      //Если у первого ответившего есть хоть один правильный ответ начисляем бал
      if (
        hasCorrectAnswerByPlayerId &&
        player?.status === PlayerStatus.IN_PROGRESS
      ) {
        await this.playerRepository.incrementScore(firstResponderPlayerId!);
      }

      const finishedGame = await this.gameRepository.getGameById(gameId);

      //Определяем статус первого игрока
      const firstPlayerStatus = await this.getPlayerStatus(
        finishedGame!.first_player.score,
        finishedGame!.second_player!.score,
      );

      //Определяем статус второго игрока
      const secondPlayerStatus = await this.getPlayerStatus(
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

    if (
      firstPlayerAnswersCount === RANDOM_QUESTIONS_COUNT ||
      secondPlayerAnswersCount === RANDOM_QUESTIONS_COUNT
    ) {
      const hasGameWithPendingCompletionDate =
        await this.gameRepository.getGameWithPendingCompletionDate(gameId);

      if (!hasGameWithPendingCompletionDate) {
        await this.gameRepository.setPendingCompletionAt(gameId);
      }
    }
  }

  @Cron(CronExpression.EVERY_SECOND)
  private async scheduleGameEnd() {
    const gamesList =
      await this.gameRepository.getGameListWithPendingCompletionDate();

    for (const game of gamesList) {
      if (game) {
        const timeSincePending =
          new Date().getTime() - game.pending_completion_at!.getTime();

        if (timeSincePending >= ANSWER_TIMEOUT_MS) {
          await this.gameRepository.finishGame(game.id);

          //Достаем все ответы для каждого игрока по player_id отсортированные дате
          const firstPlayerAnswers =
            await this.answerRepository.getAnswersByPlayerId(
              game.first_player_id,
            );

          const secondPlayerAnswers =
            await this.answerRepository.getAnswersByPlayerId(
              game.second_player_id,
            );

          //Находим первого кто ответил на все вопросы
          const firstResponderPlayerId = await this.getFirstResponderPlayerId(
            firstPlayerAnswers,
            secondPlayerAnswers,
          );

          //Есть ли у первого ответившего хоть один правильный ответ
          const hasCorrectAnswerByPlayerId =
            await this.answerRepository.hasCorrectAnswerByPlayerId(
              firstResponderPlayerId!,
            );

          const player = await this.playerRepository.getPlayerById(
            firstResponderPlayerId!,
          );

          //Если у первого ответившего есть хоть один правильный ответ начисляем бал
          if (
            hasCorrectAnswerByPlayerId &&
            player?.status === PlayerStatus.IN_PROGRESS
          ) {
            await this.playerRepository.incrementScore(firstResponderPlayerId!);
          }

          const finishedGame = await this.gameRepository.getGameById(game.id);

          //Определяем статус первого игрока
          const firstPlayerStatus = await this.getPlayerStatus(
            finishedGame!.first_player.score,
            finishedGame!.second_player!.score,
          );

          //Определяем статус второго игрока
          const secondPlayerStatus = await this.getPlayerStatus(
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
  }
}
