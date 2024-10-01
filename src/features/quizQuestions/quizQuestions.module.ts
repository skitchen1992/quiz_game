import { Module, Provider } from '@nestjs/common';
import { SharedModule } from '../../modules/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionsController } from '@features/quizQuestions/api/quizQuestions.controller';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';
import { QuizQuestionsQueryRepository } from '@features/quizQuestions/infrastructure/quiz-questions.query-repository';
import {
  CreateQuestionCommand,
  CreateQuestionHandler,
} from '@features/quizQuestions/application/handlers/create-user.handler';
import { GetQuestionHandler } from '@features/quizQuestions/application/handlers/get-question.handler';


const quizQuestionsProviders: Provider[] = [
  QuizQuestionsRepository,
  QuizQuestionsQueryRepository,
  CreateQuestionHandler,
  GetQuestionHandler
];

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([QuizQuestion]),
  ],
  providers: [...quizQuestionsProviders],
  controllers: [QuizQuestionsController],
  exports: [],
})
export class QuizQuestionsModule {
}
