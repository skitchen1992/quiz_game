import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuestionsQueryDto } from '@features/quizQuestions/api/dto/input/get-pagination-question.input.dto';
import { QuestionsOutputPaginationDto } from '@features/quizQuestions/api/dto/output/get-pagination-question.output.dto';
import { QuizQuestionsQueryRepository } from '@features/quizQuestions/infrastructure/quiz-questions.query-repository';

export class GetAllQuestionsQuery {
  constructor(public query: QuestionsQueryDto) {}
}

@QueryHandler(GetAllQuestionsQuery)
export class GetAllQuestionsHandler
  implements IQueryHandler<GetAllQuestionsQuery, QuestionsOutputPaginationDto>
{
  constructor(
    private readonly quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
  ) {}
  async execute(
    command: GetAllQuestionsQuery,
  ): Promise<QuestionsOutputPaginationDto> {
    const { query } = command;

    return await this.quizQuestionsQueryRepository.getAll(query);
  }
}
