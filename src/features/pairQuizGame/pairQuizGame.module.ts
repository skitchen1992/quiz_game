import { Module, Provider } from '@nestjs/common';
import { SharedModule } from '../../modules/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairQuizGameController } from '@features/pairQuizGame/api/pairQuizGame.controller';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import { QuestionOfGame } from '@features/pairQuizGame/domain/question-of-game.entity';
import { Answer } from '@features/pairQuizGame/domain/answer.entity';
import { Player } from '@features/pairQuizGame/domain/player.entity';

const pairQuizGameProviders: Provider[] = [];

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Game, QuestionOfGame, Answer, Player]),
  ],
  providers: [...pairQuizGameProviders],
  controllers: [PairQuizGameController],
  exports: [],
})
export class QuizQuestionsModule {}
