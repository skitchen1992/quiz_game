import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Answer,
  AnswerStatus,
} from '@features/pairQuizGame/domain/answer.entity';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';

export class FinishGameCommand {
  constructor(
    public answer: Answer,
    public playerId: string,
  ) {}
}

@CommandHandler(FinishGameCommand)
export class FinishGameHandler implements ICommandHandler<FinishGameCommand> {
  constructor(private readonly playerRepository: PlayerRepository) {}
  async execute(command: FinishGameCommand): Promise<any> {
    const { answer, playerId } = command;

    if (answer.status === AnswerStatus.CORRECT) {
      await this.playerRepository.incrementScore(playerId);
    }
  }
}

//получить игру
//получить количество ответов двух игроков
//если оба игрока ответили на все вопросы завершить игру Finished
//поменять PlayerStatus для двух игроков на win | loss | draw
//достать все ответы для каждого игрока по player_id отсортированные дате
//сравнить последние ответы по дате
//кто ответил первый и хотя бы 1 вопрос отвечен правильно тому начислить 1 бал
