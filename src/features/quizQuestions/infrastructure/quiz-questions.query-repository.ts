import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import {
  QuestionOutputDto,
  QuestionOutputDtoMapper,
} from '@features/quizQuestions/api/dto/output/question.output.dto';
import { QuestionsQueryDto } from '@features/quizQuestions/api/dto/input/get-pagination-question.input.dto';
import {
  QuestionsOutputPaginationDto,
  QuestionsOutputPaginationDtoMapper,
} from '@features/quizQuestions/api/dto/output/get-pagination-question.output.dto';

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

  public async getAll(
    query: QuestionsQueryDto,
  ): Promise<QuestionsOutputPaginationDto> {
    const {
      bodySearchTerm,
      publishedStatus = 'all',
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = query;

    // Проверка корректности направления сортировки
    const validSortDirections = ['asc', 'desc'];
    const direction = validSortDirections.includes(sortDirection)
      ? sortDirection
      : 'desc';

    // Проверка корректности поля сортировки
    const validSortFields = ['created_at', 'body'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';

    // Формирование запроса через QueryBuilder
    const queryBuilder = this.quizQuestionRepository.createQueryBuilder('q');

    // Условия поиска по publishedStatus
    if (publishedStatus === 'published') {
      queryBuilder.andWhere('q.published = true');
    } else if (publishedStatus === 'notPublished') {
      queryBuilder.andWhere('q.published = false');
    }

    // Условия поиска по body
    if (bodySearchTerm) {
      queryBuilder.andWhere('(q.body ILIKE :searchBody)', {
        searchBody: `%${bodySearchTerm}%`,
      });
    }

    // Применение сортировки и пагинации
    queryBuilder
      .addOrderBy(`q.${sortField}`, direction.toUpperCase() as 'ASC' | 'DESC')
      .skip((Number(pageNumber) - 1) * Number(pageSize))
      .take(Number(pageSize));

    // Выполнение запроса и получение результатов
    const [question, totalCount] = await queryBuilder.getManyAndCount();

    // Применение мапперов для преобразования данных в DTO
    const questionList = question.map((question) =>
      QuestionOutputDtoMapper(question),
    );

    return QuestionsOutputPaginationDtoMapper(
      questionList,
      totalCount,
      Number(pageSize),
      Number(pageNumber),
    );
  }
}
