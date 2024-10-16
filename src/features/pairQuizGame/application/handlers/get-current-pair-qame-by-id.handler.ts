import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';

export class GetCurrentPairGameByIdQuery {
  constructor(
    public userId: string,
    public gameId: string,
  ) {}
}

@QueryHandler(GetCurrentPairGameByIdQuery)
export class GetCurrentPairGameByIdHandler
  implements IQueryHandler<GetCurrentPairGameByIdQuery, Game>
{
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(command: GetCurrentPairGameByIdQuery): Promise<Game> {
    const { userId, gameId } = command;

    const game = await this.gameRepository.getGameById(gameId);

    if (!game) {
      throw new NotFoundException(`Game not found`);
    }

    if (
      game.first_player?.user_id !== userId &&
      game.second_player?.user_id !== userId
    ) {
      throw new ForbiddenException(
        `Current user tries to get pair in which user is not participant`,
      );
    }

    return game;
  }
}
