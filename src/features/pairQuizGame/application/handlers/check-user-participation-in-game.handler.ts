import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { GameStatus } from '@features/pairQuizGame/domain/game.entity';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';
import { PlayerStatus } from '@features/pairQuizGame/domain/player.entity';

export class CheckUserParticipationInGameCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CheckUserParticipationInGameCommand)
export class CheckUserParticipationInGameHandler
  implements ICommandHandler<CheckUserParticipationInGameCommand>
{
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}
  async execute(command: CheckUserParticipationInGameCommand) {
    const { userId } = command;

    const player = await this.playerRepository.getPlayerByUserIdAndStatus(
      userId,
      PlayerStatus.IN_PROGRESS,
    );

    if (player) {
      const game = await this.gameRepository.getGameByPlayerId(player.id);

      if (game && game.status !== GameStatus.FINISHED) {
        throw new ForbiddenException(
          `Current user is already participating in active pair`,
        );
      }
    }
  }
}
