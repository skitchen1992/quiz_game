import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PlayerStatus,
  Player,
} from '@features/pairQuizGame/domain/player.entity';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  public async createPlayer(userId: string): Promise<Player> {
    try {
      const newPlayer = this.playerRepository.create({
        user_id: userId,
        created_at: new Date(),
        status: PlayerStatus.IN_PROGRESS,
      });

      await this.playerRepository.save(newPlayer);

      return this.playerRepository.findOneOrFail({
        where: { id: newPlayer.id },
        relations: ['user'],
      });
    } catch (error) {
      console.error('Error creating player', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not create player');
    }
  }

  public async getPlayerByUserIdAndStatus(
    userId: string,
    status: PlayerStatus,
  ): Promise<Player | null> {
    try {
      return this.playerRepository.findOne({
        where: { user_id: userId, status: status },
      });
    } catch (error) {
      console.error('Error finding player', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not find player');
    }
  }

  public async incrementScore(playerId: string): Promise<Player> {
    try {
      const player = await this.playerRepository.findOneOrFail({
        where: { id: playerId },
      });

      player.score += 1;

      await this.playerRepository.save(player);

      return player;
    } catch (error) {
      console.error('Error incrementing score', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not increment player score',
      );
    }
  }
}
