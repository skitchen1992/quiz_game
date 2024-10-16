import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { RANDOM_QUESTIONS_COUNT } from '@utils/consts';
import { AnswerRepository } from '@features/pairQuizGame/infrastructure/answer.repository';

export class GetAnswersCountQuery {
  constructor(public playerId: string) {}
}

@QueryHandler(GetAnswersCountQuery)
export class GetAnswersCountHandler
  implements IQueryHandler<GetAnswersCountQuery, number>
{
  constructor(private readonly answerRepository: AnswerRepository) {}

  async execute(command: GetAnswersCountQuery): Promise<number> {
    const { playerId } = command;

    // Получаем количество ответов
    const answersCount = await this.answerRepository.getAnswersCountByPlayerId(
      playerId,
    );

    if (answersCount >= RANDOM_QUESTIONS_COUNT) {
      throw new ForbiddenException(
        `Current user has already answered to all questions`,
      );
    }

    return answersCount;
  }
}
