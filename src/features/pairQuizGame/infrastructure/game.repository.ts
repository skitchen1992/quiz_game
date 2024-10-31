import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
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

  public async getGameWithPendingCompletionDate(
    gameId: string,
  ): Promise<Game | null> {
    try {
      return await this.gameRepository.findOne({
        where: {
          id: gameId,
          pending_completion_at: Not(IsNull()),
        },
      });
    } catch (error) {
      console.error('Error fetching game with pending completion date', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not fetch game with pending completion date',
      );
    }
  }

  public async getGameListWithPendingCompletionDate(): Promise<Game[]> {
    try {
      return await this.gameRepository.find({
        where: {
          pending_completion_at: Not(IsNull()),
          status: GameStatus.ACTIVE,
        },
      });
    } catch (error) {
      console.error('Error fetching game with pending completion date', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException(
        'Could not fetch game with pending completion date',
      );
    }
  }

  public async getUnfinishedActiveGameByPlayerId(
    playerId: string,
  ): Promise<Game | null> {
    try {
      return await this.gameRepository
        .createQueryBuilder('game')
        .leftJoinAndSelect('game.first_player', 'first_player')
        .leftJoinAndSelect('game.second_player', 'second_player')
        .leftJoinAndSelect('first_player.user', 'first_user')
        .leftJoinAndSelect('second_player.user', 'second_user')
        .leftJoinAndSelect('first_player.answers', 'first_answers')
        .leftJoinAndSelect('second_player.answers', 'second_answers')
        .leftJoinAndSelect('game.questions', 'questions')
        .leftJoinAndSelect('questions.question', 'question')
        .where(
          '(game.first_player_id = :playerId OR game.second_player_id = :playerId)',
          { playerId },
        )
        .andWhere('game.status IN (:...statuses)', {
          statuses: [GameStatus.PENDING_SECOND_PLAYER, GameStatus.ACTIVE],
        })
        .orderBy('first_answers.created_at', 'ASC')
        .addOrderBy('second_answers.created_at', 'ASC')
        .addOrderBy('questions.order', 'ASC')
        .getOne();
    } catch (error) {
      console.error('Error fetching game by userId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not fetch game by userId');
    }
  }

  public async getActiveGameByPlayerId(playerId: string): Promise<Game | null> {
    try {
      return await this.gameRepository
        .createQueryBuilder('game')
        .leftJoinAndSelect('game.first_player', 'first_player')
        .leftJoinAndSelect('game.second_player', 'second_player')
        .leftJoinAndSelect('first_player.user', 'first_user')
        .leftJoinAndSelect('second_player.user', 'second_user')
        .leftJoinAndSelect('first_player.answers', 'first_answers')
        .leftJoinAndSelect('second_player.answers', 'second_answers')
        .leftJoinAndSelect('game.questions', 'questions')
        .leftJoinAndSelect('questions.question', 'question')
        .where(
          '(game.first_player_id = :playerId OR game.second_player_id = :playerId)',
          { playerId },
        )
        .andWhere('game.status = :status', { status: GameStatus.ACTIVE })
        .orderBy('first_answers.created_at', 'ASC')
        .addOrderBy('second_answers.created_at', 'ASC')
        .addOrderBy('questions.order', 'ASC')
        .getOne();
    } catch (error) {
      console.error('Error fetching game by userId', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not fetch game by userId');
    }
  }

  public async getGameById(gameId: string): Promise<Game | null> {
    try {
      return await this.gameRepository
        .createQueryBuilder('game')
        .leftJoinAndSelect('game.first_player', 'first_player')
        .leftJoinAndSelect('game.second_player', 'second_player')
        .leftJoinAndSelect('first_player.user', 'first_user')
        .leftJoinAndSelect('second_player.user', 'second_user')
        .leftJoinAndSelect('first_player.answers', 'first_answers')
        .leftJoinAndSelect('second_player.answers', 'second_answers')
        .leftJoinAndSelect('game.questions', 'questions')
        .leftJoinAndSelect('questions.question', 'question')
        .where('game.id = :gameId', { gameId })
        .orderBy('first_answers.created_at', 'ASC')
        .addOrderBy('second_answers.created_at', 'ASC')
        .addOrderBy('questions.order', 'ASC')
        .getOne();
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
          started_at: new Date(),
          second_player_id: secondPlayer.id,
        },
      );

      // Получаем обновленную игру с отсортированными ответами
      const updatedGame = await this.gameRepository
        .createQueryBuilder('game')
        .leftJoinAndSelect('game.first_player', 'first_player')
        .leftJoinAndSelect('game.second_player', 'second_player')
        .leftJoinAndSelect('first_player.user', 'first_user')
        .leftJoinAndSelect('second_player.user', 'second_user')
        .leftJoinAndSelect('first_player.answers', 'first_answers')
        .leftJoinAndSelect('second_player.answers', 'second_answers')
        .leftJoinAndSelect('game.questions', 'questions')
        .leftJoinAndSelect('questions.question', 'question')
        .where('game.id = :gameId', { gameId: game.id })
        .orderBy('first_answers.created_at', 'ASC')
        .addOrderBy('second_answers.created_at', 'ASC')
        .addOrderBy('questions.order', 'ASC')
        .getOne();

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

  public async finishGame(gameId: string) {
    try {
      await this.gameRepository.update(
        { id: gameId },
        {
          status: GameStatus.FINISHED,
          finished_at: new Date(),
          updated_at: new Date(),
        },
      );
    } catch (error) {
      console.error('Error finishing game', {
        error: (error as Error).message,
      });
      throw new InternalServerErrorException('Could not finish game');
    }
  }

  public async setPendingCompletionAt(gameId: string): Promise<void> {
    try {
      const currentDate = new Date();

      await this.gameRepository.update(
        { id: gameId },
        {
          updated_at: currentDate,
          pending_completion_at: currentDate,
        },
      );
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Failed to set pending completion date for game', {
        gameId,
        error: errorMessage,
      });

      throw new InternalServerErrorException(
        'Failed to set pending completion date.',
      );
    }
  }
}
