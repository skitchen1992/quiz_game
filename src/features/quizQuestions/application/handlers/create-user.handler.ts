import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateQuestionInputDto } from '@features/quizQuestions/api/dto/input/create-question.input.dto';
import { QuizQuestionsRepository } from '@features/quizQuestions/infrastructure/quiz-questions.repository';

export class CreateQuestionCommand {
  constructor(
    public body: string,
    public correctAnswers: string[],
  ) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionCommand, string>
{
  constructor(
    private readonly quizQuestionsRepository: QuizQuestionsRepository,
  ) {}
  async execute(command: CreateQuestionCommand): Promise<string> {
    const { body, correctAnswers } = command;

    const newQuestion: CreateQuestionInputDto = {
      body,
      correctAnswers
    };

    return await this.quizQuestionsRepository.create(newQuestion);
  }
}
