import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateQuestionHandler } from '@features/quizQuestions/application/handlers/create-question.handler';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';

export class DeleteQuestionCommand {
  constructor(public questionId: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionCommand, void>
{
  constructor(private readonly quizQuestionRepository: QuizQuestionsRepository) {}
  async execute(command: DeleteQuestionCommand) {
    const { questionId } = command;

    const isDeleted: boolean = await this.quizQuestionRepository.delete(questionId);

    if (!isDeleted) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }
  }
}
