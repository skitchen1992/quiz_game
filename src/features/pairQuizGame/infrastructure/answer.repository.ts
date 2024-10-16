import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Answer,
  AnswerStatus,
} from '@features/pairQuizGame/domain/answer.entity';

@Injectable()
export class AnswerRepository {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  public async getAnswersCountByPlayerId(playerId: string): Promise<number> {
    try {
      return await this.answerRepository
        .createQueryBuilder('answer')
        .where('answer.player_id = :playerId', { playerId })
        .getCount();
    } catch (error) {
      console.error('Error fetching answer count by playerId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not fetch answer count by playerId',
      );
    }
  }

  public async getAnswersByPlayerId(playerId: string): Promise<Answer[]> {
    try {
      return await this.answerRepository.find({
        where: { player_id: playerId },
        order: {
          created_at: 'ASC',
        },
      });
    } catch (error) {
      console.error('Error fetching answer by playerId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not fetch answer  by playerId',
      );
    }
  }

  public async createAnswer(
    playerId: string,
    questionId: string,
    createdAt: Date,
    status: AnswerStatus,
  ): Promise<Answer> {
    try {
      const answer = this.answerRepository.create({
        player_id: playerId,
        question_id: questionId,
        created_at: createdAt,
        status,
      });

      return await this.answerRepository.save(answer);
    } catch (error) {
      console.error('Error saving answer', {
        error: (error as Error).message,
        playerId,
        questionId,
      });
      throw new InternalServerErrorException('Could not save answer');
    }
  }

  public async hasCorrectAnswerByPlayerId(playerId: string): Promise<boolean> {
    try {
      const count = await this.answerRepository
        .createQueryBuilder('answer')
        .where('answer.player_id = :playerId', { playerId })
        .andWhere('answer.status = :status', { status: AnswerStatus.CORRECT })
        .getCount();

      return count > 0; // Возвращаем true, если есть хотя бы один ответ со статусом Correct
    } catch (error) {
      console.error('Error checking for correct answer by playerId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not check for correct answer by playerId',
      );
    }
  }
}
