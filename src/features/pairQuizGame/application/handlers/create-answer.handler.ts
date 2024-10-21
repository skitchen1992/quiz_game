import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import {
  Answer,
  AnswerStatus,
} from '@features/pairQuizGame/domain/answer.entity';
import { AnswerRepository } from '@features/pairQuizGame/infrastructure/answer.repository';
import { Player } from '@features/pairQuizGame/domain/player.entity';
import { QuestionOfGameRepository } from '@features/pairQuizGame/infrastructure/question-of-game.repository';

export class CreateAnswerCommand {
  constructor(
    public game: Game,
    public player: Player,
    public answersCount: number,
    public answer: string,
  ) {}
}

@CommandHandler(CreateAnswerCommand)
export class CreateAnswerHandler
  implements ICommandHandler<CreateAnswerCommand, Answer>
{
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionOfGameRepository: QuestionOfGameRepository,
  ) {}
  async execute(command: CreateAnswerCommand): Promise<any> {
    const { game, player, answersCount, answer } = command;

    const questionId = game.questions[answersCount].question_id;

    const questionOfGame = await this.questionOfGameRepository.findByQuestionId(
      questionId,
    );

    const correctAnswers = JSON.parse(
      questionOfGame!.question.correct_answers,
    ) as string[];

    const answerStatus = correctAnswers.some(
      (correctAnswer) => correctAnswer === answer,
    )
      ? AnswerStatus.CORRECT
      : AnswerStatus.INCORRECT;

    return await this.answerRepository.createAnswer(
      player.id,
      questionId,
      new Date(),
      answerStatus,
    );
  }
}
