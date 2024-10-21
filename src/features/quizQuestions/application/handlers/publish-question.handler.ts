import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';

export class PublishQuestionCommand {
  constructor(
    public answerId: string,
    public published: boolean,
  ) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionCommand, void>
{
  constructor(
    private readonly quizQuestionRepository: QuizQuestionsRepository,
  ) {}

  async execute(command: PublishQuestionCommand): Promise<void> {
    const { published, answerId } = command;

    const isUpdated: boolean = await this.quizQuestionRepository.publish(
      answerId,
      published,
    );

    if (!isUpdated) {
      throw new NotFoundException(`Answer with id ${answerId} not found`);
    }
  }
}
