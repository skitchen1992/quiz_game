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


  public async create(
    newQuestion: CreateQuestionInputDto,
  ): Promise<string> {
    try {
      const question = this.quizQuestionRepository.create({
        body: newQuestion.body,
        correct_answers: JSON.stringify(newQuestion.correctAnswers) ,
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

  // public async delete(userId: string): Promise<boolean> {
  //   try {
  //     const result = await this.userRepository.delete(userId);
  //
  //     return Boolean(result.affected);
  //   } catch (e) {
  //     console.error('Error during delete user operation:', e);
  //     return false;
  //   }
  // }

  // public async updatePassword(
  //   userId: string,
  //   password: string,
  // ): Promise<boolean> {
  //   try {
  //     const result = await this.userRepository.update(userId, { password });
  //
  //     return Boolean(result.affected);
  //   } catch (e) {
  //     console.error('Error during update user operation:', e);
  //     return false;
  //   }
  // }
  //


}
