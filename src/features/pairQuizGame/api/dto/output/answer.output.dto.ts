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

  outputDto.addedAt = answerResult.created_at.toISOString();
  outputDto.answerStatus = answerResult.status;
  outputDto.questionId = answerResult.question_id;

  return outputDto;
};
