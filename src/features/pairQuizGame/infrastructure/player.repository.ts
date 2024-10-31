import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Player,
  PlayerStatus,
} from '@features/pairQuizGame/domain/player.entity';
import { IStatistic } from '@features/pairQuizGame/api/dto/output/my-statistic.output.dto';

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

  public async getPlayerById(playerId: string): Promise<Player | null> {
    try {
      return this.playerRepository.findOne({
        where: { id: playerId },
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

  public async updatePlayerStatus(
    playerId: string,
    status: PlayerStatus,
  ): Promise<Player> {
    try {
      const player = await this.playerRepository.findOneOrFail({
        where: { id: playerId },
      });

      player.status = status;

      await this.playerRepository.save(player);

      return player;
    } catch (error) {
      console.error('Error updating player status', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not update player status');
    }
  }

  public async getPlayerStatisticsByUserId(
    userId: string,
  ): Promise<IStatistic | undefined> {
    try {
      return await this.playerRepository
        .createQueryBuilder('player')
        .select('COUNT(player.id)', 'gamesCount')
        .addSelect('SUM(player.score)', 'sumScore')
        .addSelect('AVG(player.score)', 'avgScores')
        .addSelect(
          `SUM(CASE WHEN player.status = :winStatus THEN 1 ELSE 0 END)`,
          'winsCount',
        )
        .addSelect(
          `SUM(CASE WHEN player.status = :lossStatus THEN 1 ELSE 0 END)`,
          'lossesCount',
        )
        .addSelect(
          `SUM(CASE WHEN player.status = :drawStatus THEN 1 ELSE 0 END)`,
          'drawsCount',
        )
        .where('player.user_id = :userId', { userId })
        .setParameters({
          winStatus: PlayerStatus.WIN,
          lossStatus: PlayerStatus.LOSS,
          drawStatus: PlayerStatus.DRAW,
        })
        .getRawOne();
    } catch (error) {
      console.error('Database query failed while fetching player statistics', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Database query failed while fetching player statistics',
      );
    }
  }
}
