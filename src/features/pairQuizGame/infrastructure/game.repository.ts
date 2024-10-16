import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatus } from '@features/pairQuizGame/domain/game.entity';
import { Player } from '@features/pairQuizGame/domain/player.entity';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  public async getGameByPlayerId(playerId: string): Promise<Game | null> {
    try {
      return await this.gameRepository.findOne({
        where: [{ first_player_id: playerId }, { second_player_id: playerId }],
      });
    } catch (error) {
      console.error('Error fetching game by userId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not fetch game by userId');
    }
  }

  public async getActiveGameByPlayerId(playerId: string): Promise<Game | null> {
    try {
      return await this.gameRepository.findOne({
        where: [
          { first_player_id: playerId, status: GameStatus.ACTIVE },
          { second_player_id: playerId, status: GameStatus.ACTIVE },
        ],
        relations: [
          'first_player',
          'second_player',
          'first_player.user',
          'second_player.user',
          'questions',
          'questions.question',
        ],
      });
    } catch (error) {
      console.error('Error fetching game by userId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not fetch game by userId');
    }
  }

  public async getGameById(gameId: string): Promise<Game | null> {
    try {
      return await this.gameRepository.findOne({
        where: [{ id: gameId }],
        relations: [
          'first_player',
          'second_player',
          'first_player.user',
          'second_player.user',
          'questions',
          'questions.question',
        ],
      });
    } catch (error) {
      console.error('Error fetching game by userId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not fetch game by userId');
    }
  }

  public async getPendingGame(): Promise<Game | null> {
    try {
      return await this.gameRepository.findOne({
        where: [{ status: GameStatus.PENDING_SECOND_PLAYER }],
        relations: ['first_player', 'second_player'],
      });
    } catch (error) {
      console.error('Error fetching pending game', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not fetch pending game');
    }
  }

  public async createGame(playerId: string): Promise<Game> {
    try {
      const newGame = this.gameRepository.create({
        first_player_id: playerId,
        created_at: new Date(),
        status: GameStatus.PENDING_SECOND_PLAYER,
      });

      return this.gameRepository.save(newGame);
    } catch (error) {
      console.error('Error creating game', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not create game');
    }
  }

  public async connectSecondPlayerToGame(
    game: Game,
    secondPlayer: Player,
  ): Promise<Game> {
    try {
      await this.gameRepository.update(
        { id: game.id },
        {
          status: GameStatus.ACTIVE,
          updated_at: new Date(),
          // pair_created_at: new Date(),
          started_at: new Date(),
          second_player_id: secondPlayer.id,
        },
      );

      const updatedGame = await this.gameRepository.findOne({
        where: { id: game.id },
        relations: [
          'first_player',
          'second_player',
          'first_player.user',
          'second_player.user',
          'questions',
          'questions.question',
        ],
      });

      if (!updatedGame) {
        throw new InternalServerErrorException(
          'Could not retrieve updated game',
        );
      }

      return updatedGame;
    } catch (error) {
      console.error('Error updating game', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not update game');
    }
  }

  public async finishGame(gameId: string): Promise<Game> {
    try {
      await this.gameRepository.update(
        { id: gameId },
        {
          status: GameStatus.FINISHED,
          finished_at: new Date(),
          updated_at: new Date(),
        },
      );

      const finishedGame = await this.gameRepository.findOne({
        where: { id: gameId },
        relations: [
          'first_player',
          'second_player',
          'first_player.user',
          'second_player.user',
          'questions',
          'questions.question',
        ],
      });

      if (!finishedGame) {
        throw new InternalServerErrorException(
          'Could not retrieve finished game',
        );
      }

      return finishedGame;
    } catch (error) {
      console.error('Error finishing game', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not finish game');
    }
  }
}
