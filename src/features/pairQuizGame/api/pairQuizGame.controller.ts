import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { BearerAuthGuard } from '@infrastructure/guards/bearer-auth-guard.service';
import { Request } from 'express';
import { GetPendingGameQuery } from '@features/pairQuizGame/application/handlers/get-qame.handler';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { CreatePlayerCommand } from '@features/pairQuizGame/application/handlers/create-player.handler';
import { Player } from '@features/pairQuizGame/domain/player.entity';
import { CreateGameCommand } from '@features/pairQuizGame/application/handlers/create-qame.handler';
import {
  ActiveGameDtoMapper,
  PendingGameDtoMapper,
} from '@features/pairQuizGame/api/dto/output/connection.output.dto';
import { ConnectToPendingGameCommand } from '@features/pairQuizGame/application/handlers/connect-to-panding-game.handler';
import { CheckUserParticipationInGameCommand } from '@features/pairQuizGame/application/handlers/check-user-participation-in-game.handler';
import { GetCurrentPairGameQuery } from '@features/pairQuizGame/application/handlers/get-current-pair-qame.handler';
import { GetCurrentPairGameByIdQuery } from '@features/pairQuizGame/application/handlers/get-current-pair-qame-by-id.handler';
import { AnswerDto } from '@features/pairQuizGame/api/dto/input/create-blog.input.dto';
import { GetPlayerQuery } from '@features/pairQuizGame/application/handlers/get-player.handler';
import { GetAnswersCountQuery } from '@features/pairQuizGame/application/handlers/get-answers-count.handler';
import { Answer } from '@features/pairQuizGame/domain/answer.entity';
import { CreateAnswerCommand } from '@features/pairQuizGame/application/handlers/create-answer.handler';
import { AnswerDtoMapper } from '@features/pairQuizGame/api/dto/output/answer.output.dto';
import { UpdateScoreCommand } from '@features/pairQuizGame/application/handlers/update-score.handler';
import { FinishGameCommand } from '@features/pairQuizGame/application/handlers/finish-game.handler';

@SkipThrottle()
@ApiTags('PairQuizGame')
@Controller('pair-game-quiz/pairs')
@ApiSecurity('bearer')
@UseGuards(BearerAuthGuard)
export class PairQuizGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Post('connection')
  async connection(@Req() request: Request) {
    const user = request.currentUser!;

    // Проверяет участие пользователя в игре
    await this.commandBus.execute<CheckUserParticipationInGameCommand>(
      new CheckUserParticipationInGameCommand(user.id),
    );

    // Запрашивает информацию о текущей ожидающей игре для пользователя
    const game = await this.queryBus.execute<GetPendingGameQuery, Game | null>(
      new GetPendingGameQuery(user),
    );

    // Создает игрока в системе на основе текущего пользователя
    const player = await this.commandBus.execute<CreatePlayerCommand, Player>(
      new CreatePlayerCommand(user.id),
    );

    if (game) {
      // Если ожидающая игра найдена, подключает игрока к ней
      const activeGame = await this.commandBus.execute<
        ConnectToPendingGameCommand,
        Game
      >(new ConnectToPendingGameCommand(game, player));

      // Возвращает информацию об активной игре
      return ActiveGameDtoMapper(activeGame);
    } else {
      // Если ожидающая игра не найдена, создаёт новую игру
      const game = await this.commandBus.execute<CreateGameCommand, Game>(
        new CreateGameCommand(player.id),
      );

      // Возвращает информацию о новой ожидающей игре
      return PendingGameDtoMapper(game, player);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Get('my-current')
  async currenGame(@Req() request: Request) {
    const user = request.currentUser!;

    // Запрашивает информацию о текущей активной игре для пользователя
    const game = await this.queryBus.execute<GetCurrentPairGameQuery, Game>(
      new GetCurrentPairGameQuery(user.id),
    );

    // Возвращает информацию об активной игре
    return ActiveGameDtoMapper(game);
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Get(':gameId')
  async getGameById(
    @Req() request: Request,
    @Param('gameId', ParseUUIDPipe) gameId: string,
  ) {
    const user = request.currentUser!;

    const game = await this.queryBus.execute<GetCurrentPairGameByIdQuery, Game>(
      new GetCurrentPairGameByIdQuery(user.id, gameId),
    );

    // Возвращает информацию об активной игре
    return ActiveGameDtoMapper(game);
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Post('my-current/answers')
  async answers(@Req() request: Request, @Body() input: AnswerDto) {
    const user = request.currentUser!;

    const { answer } = input;

    // Запрашивает информацию о текущем пользователе в паре
    const player = await this.queryBus.execute<GetPlayerQuery, Player>(
      new GetPlayerQuery(user.id),
    );

    // Запрашивает информацию о количестве ответов
    const answersCount = await this.queryBus.execute<
      GetAnswersCountQuery,
      number
    >(new GetAnswersCountQuery(player.id));

    // Запрашивает информацию о текущей активной парной игре для пользователя
    const game = await this.queryBus.execute<GetCurrentPairGameQuery, Game>(
      new GetCurrentPairGameQuery(user.id),
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

    console.log('game', game);
    // Заканчиваем игру
    await this.commandBus.execute<FinishGameCommand>(
      new FinishGameCommand(answerResult, player.id),
    );

    // Возвращает результат ответа
    return AnswerDtoMapper(answerResult);
  }
}
