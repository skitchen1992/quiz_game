import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import { PlayerStatus } from '@features/pairQuizGame/domain/player.entity';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';

export class GetCurrentPairGameQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetCurrentPairGameQuery)
export class GetCurrentPairGameHandler
  implements IQueryHandler<GetCurrentPairGameQuery, Game>
{
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(command: GetCurrentPairGameQuery): Promise<Game> {
    const { userId } = command;

    const player = await this.playerRepository.getPlayerByUserIdAndStatus(
      userId,
      PlayerStatus.IN_PROGRESS,
    );

    if (!player) {
      throw new NotFoundException(`Game not found`);
    }

    const game = await this.gameRepository.getActiveGameByPlayerId(player.id);

    if (!game) {
      throw new NotFoundException(`Game not found`);
    }
    return game;
  }
}
