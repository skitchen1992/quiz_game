import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';

export class QuestionOutputDto {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string | null;
}

// MAPPERS

export const QuestionOutputDtoMapper = (
  question: QuizQuestion,
): QuestionOutputDto => {
  const outputDto = new QuestionOutputDto();

  outputDto.id = question.id;
  outputDto.body = question.body;
  outputDto.correctAnswers = JSON.parse(question.correct_answers);
  outputDto.published = question.published;
  outputDto.createdAt = question.created_at.toISOString();
  outputDto.updatedAt = question.updated_at
    ? question.updated_at.toISOString()
    : question.updated_at;

  return outputDto;
};
