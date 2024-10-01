import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { QuizQuestionsQueryRepository } from '@features/quizQuestions/infrastructure/quiz-questions.query-repository';
import { QuestionOutputDto } from '@features/quizQuestions/api/dto/output/question.output.dto';

export class GetQuestionQuery {
  constructor(public questionId: string) {
  }
}

@QueryHandler(GetQuestionQuery)
export class GetQuestionHandler
  implements IQueryHandler<GetQuestionQuery, QuestionOutputDto> {
  constructor(private readonly quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
  ) {
  }

  async execute(command: GetQuestionQuery): Promise<QuestionOutputDto> {
    const { questionId } = command;

    const question = await this.quizQuestionsQueryRepository.getById(questionId);

    if (!question) {
      throw new NotFoundException(`User with id ${questionId} not found`);
    }

    return question;
  }
}
