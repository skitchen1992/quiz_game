import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';

export class GetPendingGameQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetPendingGameQuery)
export class GetPendingGameHandler
  implements IQueryHandler<GetPendingGameQuery, Game | null>
{
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(command: GetPendingGameQuery): Promise<Game | null> {
    const { userId } = command;

    const game = await this.gameRepository.getPendingGame();

    if (
      game &&
      (game.first_player.user_id === userId ||
        game.second_player?.user_id === userId)
    ) {
      throw new ForbiddenException(
        `Current user is already participating in active pair`,
      );
    }

    return game;
  }
}
