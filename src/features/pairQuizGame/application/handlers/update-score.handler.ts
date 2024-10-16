import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Answer,
  AnswerStatus,
} from '@features/pairQuizGame/domain/answer.entity';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';

export class UpdateScoreCommand {
  constructor(
    public answer: Answer,
    public playerId: string,
  ) {}
}

@CommandHandler(UpdateScoreCommand)
export class UpdateScoreHandler
  implements ICommandHandler<UpdateScoreCommand, Answer>
{
  constructor(private readonly playerRepository: PlayerRepository) {}
  async execute(command: UpdateScoreCommand): Promise<any> {
    const { answer, playerId } = command;

    if (answer.status === AnswerStatus.CORRECT) {
      await this.playerRepository.incrementScore(playerId);
    }
  }
}
