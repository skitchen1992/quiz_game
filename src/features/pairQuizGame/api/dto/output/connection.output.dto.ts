import { Game, GameStatus } from '@features/pairQuizGame/domain/game.entity';
import { AnswerStatus } from '@features/pairQuizGame/domain/answer.entity';
import { Player } from '@features/pairQuizGame/domain/player.entity';

interface Answer {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
}

interface PlayerProgress {
  answers: Answer[] | null;
  player: {
    id: string;
    login: string;
  };
  score: number;
}

interface Question {
  id: string;
  body: string;
}

export class ConnectionOutputDto {
  id: string;
  firstPlayerProgress: PlayerProgress;
  secondPlayerProgress: PlayerProgress | null;
  questions: Question[] | null;
  status: GameStatus;
  pairCreatedDate: string | null;
  startGameDate: string | null;
  finishGameDate: string | null;
}

// MAPPERS

export const PendingGameDtoMapper = (
  game: Game,
  player: Player,
): ConnectionOutputDto => {
  const outputDto = new ConnectionOutputDto();

  outputDto.id = game.id;
  outputDto.firstPlayerProgress = {
    answers: null,
    player: {
      id: player.id,
      login: player.user.login,
    },
    score: player.score,
  };
  outputDto.secondPlayerProgress = null;
  outputDto.questions = null;
  outputDto.pairCreatedDate = null;
  outputDto.startGameDate = null;
  outputDto.finishGameDate = null;

  return outputDto;
};

export const ActiveGameDtoMapper = (game: Game): ConnectionOutputDto => {
  const outputDto = new ConnectionOutputDto();

  outputDto.id = game.id;
  outputDto.firstPlayerProgress = {
    answers: null,
    player: {
      id: game.first_player_id,
      login: game.first_player!.user.login,
    },
    score: game.first_player!.score,
  };
  outputDto.secondPlayerProgress = {
    answers: null,
    player: {
      id: game.second_player_id,
      login: game.second_player!.user.login,
    },
    score: game.second_player!.score,
  };
  outputDto.questions = game.questions.map((question) => ({
    id: question.question.id,
    body: question.question.body,
  }));
  outputDto.pairCreatedDate = game.pair_created_at!.toISOString();
  outputDto.startGameDate = game.started_at!.toISOString();
  outputDto.finishGameDate = null;

  return outputDto;
};
