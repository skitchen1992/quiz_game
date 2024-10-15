import { v4 as uuidv4 } from 'uuid';
import { PlayerStatus } from '@features/pairQuizGame/domain/player.entity';
import {
  Answer,
  AnswerStatus,
} from '@features/pairQuizGame/domain/answer.entity';

export const getUniqueId = () => {
  return uuidv4();
};

export function sleep(duration: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), duration);
  });
}

export function getPlayerStatus(
  firstPlayerScore: number,
  secondPlayerScore: number,
): PlayerStatus {
  if (firstPlayerScore > secondPlayerScore) {
    return PlayerStatus.WIN;
  }

  if (firstPlayerScore < secondPlayerScore) {
    return PlayerStatus.LOSS;
  }

  return PlayerStatus.DRAW;
}

export function getFirstResponderPlayerId(
  firstPlayerAnswers: Answer[],
  secondPlayerAnswers: Answer[],
): string {
  const firstPlayerLastAnswerDate = firstPlayerAnswers.at(-1);
  const secondPlayerLastAnswerDate = secondPlayerAnswers.at(-1);

  return firstPlayerLastAnswerDate!.created_at <
    secondPlayerLastAnswerDate!.created_at
    ? firstPlayerLastAnswerDate!.player_id
    : secondPlayerLastAnswerDate!.player_id;
}
