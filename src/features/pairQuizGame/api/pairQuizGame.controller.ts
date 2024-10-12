import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  HttpCode,
  HttpStatus,
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
}
