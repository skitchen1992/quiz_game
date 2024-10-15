import {
  Answer,
  AnswerStatus,
} from '@features/pairQuizGame/domain/answer.entity';

export class AnswerOutputDto {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
}

// MAPPERS

export const AnswerDtoMapper = (answerResult: Answer): AnswerOutputDto => {
  const outputDto = new AnswerOutputDto();

  outputDto.questionId = answerResult.question_id;
  outputDto.answerStatus = answerResult.status;
  outputDto.addedAt = answerResult.created_at.toISOString();

  return outputDto;
};
