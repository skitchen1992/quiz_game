import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { CreateQuestionInputDto } from '@features/quizQuestions/api/dto/input/create-question.input.dto';

@Injectable()
export class QuizQuestionsRepository {
  constructor(
    @InjectRepository(QuizQuestion)
    private quizQuestionRepository: Repository<QuizQuestion>,
  ) {}

  public async create(newQuestion: CreateQuestionInputDto): Promise<string> {
    try {
      const question = this.quizQuestionRepository.create({
        body: newQuestion.body,
        correct_answers: JSON.stringify(newQuestion.correctAnswers),
        published: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedQuestion = await this.quizQuestionRepository.save(question);

      return savedQuestion.id;
    } catch (error) {
      console.error('Error inserting question into database', { error });
      throw new InternalServerErrorException('Could not create question');
    }
  }

  public async delete(questionId: string): Promise<boolean> {
    try {
      const result = await this.quizQuestionRepository.delete(questionId);

      return Boolean(result.affected);
    } catch (error) {
      console.error('Error during delete user operation:', { error });
      throw new InternalServerErrorException('Could not delete question');
    }
  }

  public async update(
    answerId: string,
    body: string,
    correctAnswers: string[],
  ): Promise<boolean> {
    try {
      const result = await this.quizQuestionRepository.update(answerId, {
        body,
        correct_answers: JSON.stringify(correctAnswers),
      });

      return Boolean(result.affected);
    } catch (error) {
      console.error('Error during update answer operation:', { error });
      throw new InternalServerErrorException('Could not update question');
    }
  }

  public async publish(answerId: string, published: boolean): Promise<boolean> {
    try {
      const result = await this.quizQuestionRepository.update(answerId, {
        published,
      });

      return Boolean(result.affected);
    } catch (error) {
      console.error('Error during publish answer operation:', { error });
      throw new InternalServerErrorException('Could not publish question');
    }
  }
}
