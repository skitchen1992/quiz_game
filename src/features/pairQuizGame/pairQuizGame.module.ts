import { Module, Provider } from '@nestjs/common';
import { SharedModule } from '../../modules/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairQuizGameController } from '@features/pairQuizGame/api/pairQuizGame.controller';
import { Game } from '@features/pairQuizGame/domain/game.entity';

const pairQuizGameProviders: Provider[] = [];

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Game])],
  providers: [...pairQuizGameProviders],
  controllers: [PairQuizGameController],
  exports: [],
})
export class QuizQuestionsModule {}
