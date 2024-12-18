import { Module, Provider } from '@nestjs/common';
import { SharedModule } from '../../modules/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairQuizGameController } from '@features/pairQuizGame/api/pairQuizGame.controller';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { QuestionOfGame } from '@features/pairQuizGame/domain/question-of-game.entity';
import { Answer } from '@features/pairQuizGame/domain/answer.entity';
import { Player } from '@features/pairQuizGame/domain/player.entity';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { GetPendingGameHandler } from '@features/pairQuizGame/application/handlers/get-qame.handler';
import { PlayerRepository } from '@features/pairQuizGame/infrastructure/player.repository';
import { CreatePlayerHandler } from '@features/pairQuizGame/application/handlers/create-player.handler';
import { GameRepository } from '@features/pairQuizGame/infrastructure/game.repository';
import { CreateGameHandler } from '@features/pairQuizGame/application/handlers/create-qame.handler';
import { ConnectToPendingGameHandler } from '@features/pairQuizGame/application/handlers/connect-to-panding-game.handler';
import { CheckUserParticipationInGameHandler } from '@features/pairQuizGame/application/handlers/check-user-participation-in-game.handler';
import { QuestionOfGameRepository } from '@features/pairQuizGame/infrastructure/question-of-game.repository';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';
import { GetCurrentPairGameHandler } from '@features/pairQuizGame/application/handlers/get-current-pair-qame.handler';
import { GetCurrentPairGameByIdHandler } from '@features/pairQuizGame/application/handlers/get-current-pair-qame-by-id.handler';
import { GetPlayerHandler } from '@features/pairQuizGame/application/handlers/get-player.handler';
import { AnswerRepository } from '@features/pairQuizGame/infrastructure/answer.repository';
import { GetAnswersCountHandler } from '@features/pairQuizGame/application/handlers/get-answers-count.handler';
import { CreateAnswerHandler } from '@features/pairQuizGame/application/handlers/create-answer.handler';
import { UpdateScoreHandler } from '@features/pairQuizGame/application/handlers/update-score.handler';
import { FinishGameHandler } from '@features/pairQuizGame/application/handlers/finish-game.handler';
import { GameService } from '@features/pairQuizGame/application/game.service';
import { GameQueryRepository } from '@features/pairQuizGame/infrastructure/game.query-repository';
import { PlayerQueryRepository } from '@features/pairQuizGame/infrastructure/player.query-repository';

const handlers: Provider[] = [
  GetPendingGameHandler,
  CreatePlayerHandler,
  CreateGameHandler,
  ConnectToPendingGameHandler,
  CheckUserParticipationInGameHandler,
  GetCurrentPairGameHandler,
  GetCurrentPairGameByIdHandler,
  GetPlayerHandler,
  GetAnswersCountHandler,
  CreateAnswerHandler,
  UpdateScoreHandler,
  FinishGameHandler,
  GameService,
];

const repositories: Provider[] = [
  PlayerRepository,
  PlayerQueryRepository,
  GameRepository,
  GameQueryRepository,
  QuestionOfGameRepository,
  QuizQuestionsRepository,
  AnswerRepository,
];

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      QuizQuestion,
      Game,
      QuestionOfGame,
      Answer,
      Player,
    ]),
  ],
  providers: [...handlers, ...repositories],
  controllers: [PairQuizGameController],
  exports: [],
})
export class PairQuizModule {}
