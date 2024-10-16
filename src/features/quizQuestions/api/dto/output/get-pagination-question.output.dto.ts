import { getPageCount } from '@utils/pagination';
import { QuestionOutputDto } from '@features/quizQuestions/api/dto/output/question.output.dto';

export class QuestionsOutputPaginationDto {
  items: QuestionOutputDto[];
  totalCount: number;
  pageSize: number;
  page: number;
  pagesCount: number;
}

// MAPPERS

export const QuestionsOutputPaginationDtoMapper = (
  questionList: QuestionOutputDto[],
  totalCount: number,
  pageSize: number,
  page: number,
): QuestionsOutputPaginationDto => {
  const outputDto = new QuestionsOutputPaginationDto();

  outputDto.pagesCount = getPageCount(totalCount, pageSize);
  outputDto.page = page;
  outputDto.pageSize = pageSize;
  outputDto.totalCount = totalCount;
  outputDto.items = questionList;

  return outputDto;
};
