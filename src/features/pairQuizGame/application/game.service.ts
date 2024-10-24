import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CheckUserParticipationInGameCommand } from '@features/pairQuizGame/application/handlers/check-user-participation-in-game.handler';
import { GetPendingGameQuery } from '@features/pairQuizGame/application/handlers/get-qame.handler';
import { Game, GameStatus } from '@features/pairQuizGame/domain/game.entity';
import { CreatePlayerCommand } from '@features/pairQuizGame/application/handlers/create-player.handler';
import { Player } from '@features/pairQuizGame/domain/player.entity';
import { ConnectToPendingGameCommand } from '@features/pairQuizGame/application/handlers/connect-to-panding-game.handler';
import {
  GameDtoMapper,
  PendingGameDtoMapper,
} from '@features/pairQuizGame/api/dto/output/connection.output.dto';
import { CreateGameCommand } from '@features/pairQuizGame/application/handlers/create-qame.handler';
import { GetCurrentPairGameByIdQuery } from '@features/pairQuizGame/application/handlers/get-current-pair-qame-by-id.handler';
import { AnswerDto } from '@features/pairQuizGame/api/dto/input/answer.input.dto';
import { GetPlayerQuery } from '@features/pairQuizGame/application/handlers/get-player.handler';
import { GetAnswersCountQuery } from '@features/pairQuizGame/application/handlers/get-answers-count.handler';
import { GetCurrentPairGameQuery } from '@features/pairQuizGame/application/handlers/get-current-pair-qame.handler';
import { CreateAnswerCommand } from '@features/pairQuizGame/application/handlers/create-answer.handler';
import { Answer } from '@features/pairQuizGame/domain/answer.entity';
import { UpdateScoreCommand } from '@features/pairQuizGame/application/handlers/update-score.handler';
import { FinishGameCommand } from '@features/pairQuizGame/application/handlers/finish-game.handler';
import { AnswerDtoMapper } from '@features/pairQuizGame/api/dto/output/answer.output.dto';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';
import { MyStatisticDtoMapper } from '@features/pairQuizGame/api/dto/output/my-statistic.output.dto';
import { GameQueryRepository } from '@features/pairQuizGame/infrastructure/game.query-repository';
import { GameQuery } from '@features/pairQuizGame/api/dto/output/game.output.pagination.dto';
import { TopQueryDto } from '@features/pairQuizGame/api/dto/input/top.input.dto';
import { PlayerQueryRepository } from '@features/pairQuizGame/infrastructure/player.query-repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly playerRepository: PlayerRepository,
    private readonly playerQueryRepository: PlayerQueryRepository,
    private readonly gameQueryRepository: GameQueryRepository,
  ) {}

  async handleConnection(userId: string) {
    // Проверяет участие пользователя в игре
    await this.commandBus.execute<CheckUserParticipationInGameCommand>(
      new CheckUserParticipationInGameCommand(userId),
    );

    // Запрашивает информацию о текущей ожидающей игре для пользователя
    const game = await this.queryBus.execute<GetPendingGameQuery, Game | null>(
      new GetPendingGameQuery(userId),
    );

    // Создает игрока в системе на основе текущего пользователя
    const player = await this.commandBus.execute<CreatePlayerCommand, Player>(
      new CreatePlayerCommand(userId),
    );

    if (game) {
      // Если ожидающая игра найдена, подключает игрока к ней
      const activeGame = await this.commandBus.execute<
        ConnectToPendingGameCommand,
        Game
      >(new ConnectToPendingGameCommand(game, player));

      // Возвращает информацию об активной игре
      return GameDtoMapper(activeGame);
    } else {
      // Если ожидающая игра не найдена, создаёт новую игру
      const game = await this.commandBus.execute<CreateGameCommand, Game>(
        new CreateGameCommand(player.id),
      );

      // Возвращает информацию о новой ожидающей игре
      return PendingGameDtoMapper(game, player);
    }
  }

  async getGameById(userId: string, gameId: string) {
    // Получает игру по ID
    const game = await this.queryBus.execute<GetCurrentPairGameByIdQuery, Game>(
      new GetCurrentPairGameByIdQuery(userId, gameId),
    );

    // Если статус игры не ожидает второго игрока, возвращаем активную игру
    if (game.status !== GameStatus.PENDING_SECOND_PLAYER) {
      return GameDtoMapper(game);
    } else {
      // Иначе возвращаем ожидающую игру
      return PendingGameDtoMapper(game, game.first_player);
    }
  }

  async handlePlayerAnswer(userId: string, input: AnswerDto) {
    const { answer } = input;

    // Запрашивает информацию о текущем пользователе в паре
    const player = await this.queryBus.execute<GetPlayerQuery, Player>(
      new GetPlayerQuery(userId),
    );

    // Запрашивает информацию о количестве ответов
    const answersCount = await this.queryBus.execute<
      GetAnswersCountQuery,
      number
    >(new GetAnswersCountQuery(player.id));

    // Запрашивает информацию о текущей активной парной игре для пользователя
    const game = await this.queryBus.execute<GetCurrentPairGameQuery, Game>(
      new GetCurrentPairGameQuery(userId),
    );

    // Отвечаем на вопрос
    const answerResult = await this.commandBus.execute<
      CreateAnswerCommand,
      Answer
    >(new CreateAnswerCommand(game, player, answersCount, answer));

    // Начисляем или не начисляем очки
    await this.commandBus.execute<UpdateScoreCommand>(
      new UpdateScoreCommand(answerResult, player.id),
    );

    // Заканчиваем игру
    await this.commandBus.execute<FinishGameCommand>(
      new FinishGameCommand(game.id),
    );

    // Возвращает результат ответа
    return AnswerDtoMapper(answerResult);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  async getCurrentGame(userId: string) {
    // Запрашивает информацию о текущей активной игре для пользователя
    const game = await this.queryBus.execute<GetCurrentPairGameQuery, Game>(
      new GetCurrentPairGameQuery(userId),
    );

    // Если статус игры не ожидает второго игрока, возвращаем активную игру
    if (game.status !== GameStatus.PENDING_SECOND_PLAYER) {
      return GameDtoMapper(game);
    } else {
      // Иначе возвращаем ожидающую игру
      return PendingGameDtoMapper(game, game.first_player);
    }
  }

  async getStatistic(userId: string) {
    const statistics = await this.playerRepository.getPlayerStatisticsByUserId(
      userId,
    );
    return MyStatisticDtoMapper(statistics);
  }

  async getAllGames(query: GameQuery, userId: string) {
    return await this.gameQueryRepository.getAll(query, userId);
  }
  async getTop(query: TopQueryDto) {
    return await this.playerQueryRepository.getTop(query);
  }
}
