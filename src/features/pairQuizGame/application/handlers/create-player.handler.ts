import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';
import { Player } from '@features/pairQuizGame/domain/player.entity';

export class CreatePlayerCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePlayerCommand)
export class CreatePlayerHandler
  implements ICommandHandler<CreatePlayerCommand, Player>
{
  constructor(private readonly playerRepository: PlayerRepository) {}
  async execute(command: CreatePlayerCommand): Promise<Player> {
    const { userId } = command;

    return await this.playerRepository.createPlayer(userId);
  }
}
