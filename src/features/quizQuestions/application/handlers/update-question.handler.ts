import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';

export class UpdateQuestionCommand {
  constructor(
    public body: string,
    public correctAnswers: string[],
    public answerId: string,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler
  implements ICommandHandler<UpdateQuestionCommand, void>
{
  constructor(
    private readonly quizQuestionRepository: QuizQuestionsRepository,
  ) {}

  async execute(command: UpdateQuestionCommand): Promise<void> {
    const { body, correctAnswers, answerId } = command;

    const isUpdated: boolean = await this.quizQuestionRepository.update(
      answerId,
      body,
      correctAnswers,
    );

    if (!isUpdated) {
      throw new NotFoundException(`Answer with id ${answerId} not found`);
    }
  }
}
