import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import {
  Player,
  PlayerStatus,
} from '@features/pairQuizGame/domain/player.entity';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';
import { AnswerRepository } from '@features/pairQuizGame/infrastructure/answer.repository';

export class GetPlayerQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetPlayerQuery)
export class GetPlayerHandler implements IQueryHandler<GetPlayerQuery, Player> {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly answerRepository: AnswerRepository,
  ) {}

  async execute(command: GetPlayerQuery): Promise<Player> {
    const { userId } = command;

    // Получаем игрока по идентификатору пользователя и статусу "в процессе"
    const player = await this.playerRepository.getPlayerByUserIdAndStatus(
      userId,
      PlayerStatus.IN_PROGRESS,
    );

    if (!player) {
      throw new ForbiddenException(`Current user is not inside active pair`);
    }

    // Получаем активную игру по идентификатору найденного игрока. В активной игре есть пара
    const game = await this.gameRepository.getActiveGameByPlayerId(player.id);

    if (!game) {
      throw new ForbiddenException(`Current user is not inside active pair`);
    }

    return player;
  }
}
