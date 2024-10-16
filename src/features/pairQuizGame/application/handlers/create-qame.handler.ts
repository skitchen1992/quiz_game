import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import { Game } from '@features/pairQuizGame/domain/game.entity';

export class CreateGameCommand {
  constructor(public playerId: string) {}
}

@CommandHandler(CreateGameCommand)
export class CreateGameHandler
  implements ICommandHandler<CreateGameCommand, Game>
{
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(command: CreateGameCommand): Promise<Game> {
    const { playerId } = command;

    return await this.gameRepository.createGame(playerId);
  }
}
