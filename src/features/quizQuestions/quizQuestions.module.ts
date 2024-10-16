import { Module, Provider } from '@nestjs/common';
import { SharedModule } from '../../modules/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionsController } from '@features/quizQuestions/api/quizQuestions.controller';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';
import { QuizQuestionsQueryRepository } from '@features/quizQuestions/infrastructure/quiz-questions.query-repository';
import { CreateQuestionHandler } from '@features/quizQuestions/application/handlers/create-question.handler';
import { GetQuestionHandler } from '@features/quizQuestions/application/handlers/get-question.handler';
import { DeleteQuestionHandler } from '@features/quizQuestions/application/handlers/delete-question.handler';
import { UpdateQuestionHandler } from '@features/quizQuestions/application/handlers/update-question.handler';
import { PublishQuestionHandler } from '@features/quizQuestions/application/handlers/publish-question.handler';
import { GetAllQuestionsHandler } from '@features/quizQuestions/application/handlers/get-all-questions.handler';

const quizQuestionsProviders: Provider[] = [
  QuizQuestionsRepository,
  QuizQuestionsQueryRepository,
  CreateQuestionHandler,
  GetQuestionHandler,
  DeleteQuestionHandler,
  UpdateQuestionHandler,
  PublishQuestionHandler,
  GetAllQuestionsHandler,
];

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([QuizQuestion])],
  providers: [...quizQuestionsProviders],
  controllers: [QuizQuestionsController],
  exports: [],
})
export class QuizQuestionsModule {}
