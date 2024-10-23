import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '@features/pairQuizGame/domain/game.entity';
import {
  GameOutputPaginationDto,
  GameOutputPaginationDtoMapper,
  GameQuery,
} from '@features/pairQuizGame/api/dto/output/game.output.pagination.dto';
import { GameDtoMapper } from '@features/pairQuizGame/api/dto/output/connection.output.dto';

@Injectable()
export class GameQueryRepository {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  public async getAll(
    query: GameQuery,
    userId: string,
  ): Promise<GameOutputPaginationDto> {
    const {
      sortBy = 'pairCreatedDate',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = query;

    const validSortDirections = ['asc', 'desc'];
    const direction = validSortDirections.includes(sortDirection)
      ? sortDirection
      : 'desc';

    const validSortFields = ['created_at', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';

    const queryBuilder = this.gameRepository.createQueryBuilder('game');

    queryBuilder
      .leftJoinAndSelect('game.first_player', 'first_player')
      .leftJoinAndSelect('game.second_player', 'second_player')
      .leftJoinAndSelect('first_player.user', 'first_user')
      .leftJoinAndSelect('second_player.user', 'second_user')
      .leftJoinAndSelect('first_player.answers', 'first_answers')
      .leftJoinAndSelect('second_player.answers', 'second_answers')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('questions.question', 'question')
      .where('first_player.user_id = :userId ', {
        userId,
      })
      .orWhere('second_player.user_id = :userId', {
        userId,
      })
      .addOrderBy('questions.order', 'ASC')
      .addOrderBy(
        `game.${sortField}`,
        direction.toUpperCase() as 'ASC' | 'DESC',
      )
      .addOrderBy(`game.created_at`, 'DESC')
      .skip((Number(pageNumber) - 1) * Number(pageSize))
      .take(Number(pageSize));

    const [games, totalCount] = await queryBuilder.getManyAndCount();

    const gameList = games.map((game) => GameDtoMapper(game));

    return GameOutputPaginationDtoMapper(
      gameList,
      totalCount,
      Number(pageSize),
      Number(pageNumber),
    );
  }
}
