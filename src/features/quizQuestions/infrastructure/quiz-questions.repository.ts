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
        updated_at: null,
      });

      const savedQuestion = await this.quizQuestionRepository.save(question);

      return savedQuestion.id;
    } catch (error) {
      console.error('Error inserting question into database', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not create question');
    }
  }

  public async delete(questionId: string): Promise<boolean> {
    try {
      const result = await this.quizQuestionRepository.delete(questionId);

      return Boolean(result.affected);
    } catch (error) {
      console.error('Error during delete user operation', {
        error: (error as Error).message,
      });
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
        updated_at: new Date(),
      });

      return Boolean(result.affected);
    } catch (error) {
      console.error('Error during update answer operation', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not update question');
    }
  }

  public async publish(answerId: string, published: boolean): Promise<boolean> {
    try {
      const result = await this.quizQuestionRepository.update(answerId, {
        published,
        updated_at: new Date(),
      });

      return Boolean(result.affected);
    } catch (error) {
      console.error('Error during publish answer operation', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not publish question');
    }
  }

  public async getRandomQuestions(limit: number): Promise<QuizQuestion[]> {
    try {
      return await this.quizQuestionRepository
        .createQueryBuilder('question')
        .orderBy('RANDOM()')
        .limit(limit)
        .getMany();
    } catch (error) {
      console.error('Error fetching random questions:', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not fetch random questions',
      );
    }
  }
}
