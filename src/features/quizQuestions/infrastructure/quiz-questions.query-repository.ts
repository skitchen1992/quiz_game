import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { QuestionOutputDto, QuestionOutputDtoMapper } from '@features/quizQuestions/api/dto/output/question.output.dto';

@Injectable()
export class QuizQuestionsQueryRepository {
  constructor(
    @InjectRepository(QuizQuestion)
    private quizQuestionRepository: Repository<QuizQuestion>,
  ) {}

  public async getById(questionId: string): Promise<QuestionOutputDto | null> {
    const question = await this.quizQuestionRepository.findOne({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return null;
    }

    return QuestionOutputDtoMapper(question);
  }


}
