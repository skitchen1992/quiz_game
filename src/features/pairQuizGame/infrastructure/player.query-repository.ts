import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Player,
  PlayerStatus,
} from '@features/pairQuizGame/domain/player.entity';
import { IStatistic } from '@features/pairQuizGame/api/dto/output/my-statistic.output.dto';
import { TopQueryDto } from '@features/pairQuizGame/api/dto/input/top.input.dto';
import { GameDtoMapper } from '@features/pairQuizGame/api/dto/output/connection.output.dto';
import { GameOutputPaginationDtoMapper } from '@features/pairQuizGame/api/dto/output/game.output.pagination.dto';
import {
  ITop,
  TopOutputPaginationDtoMapper,
  TopStatisticDtoMapper,
} from '@features/pairQuizGame/api/dto/output/top.output.pagination.dto';
import { getLogger } from 'nodemailer/lib/shared';

// @Injectable()
// export class PlayerQueryRepository {
//   constructor(
//     @InjectRepository(Player)
//     private playerRepository: Repository<Player>,
//   ) {}
//
//   public async getTop(query: TopQueryDto): Promise<any> {
//     try {
//       const { sort, pageNumber = 1, pageSize = 10 } = query;
//
//       const defaultSort = ['avgScores desc', 'sumScore desc'];
//       const sortField = sort?.length ? sort : defaultSort;
//
//       const queryBuilder = this.playerRepository
//         .createQueryBuilder('player')
//         .leftJoinAndSelect('player.user', 'user')
//         .select('user.id', 'userId')
//         .addSelect('user.login', 'userLogin')
//         .addSelect('COUNT(player.id)', 'gamesCount')
//         .addSelect('SUM(player.score)', 'sumScore')
//         .addSelect('AVG(player.score)', 'avgScores')
//         .addSelect(
//           `SUM(CASE WHEN player.status = :winStatus THEN 1 ELSE 0 END)`,
//           'winsCount',
//         )
//         .addSelect(
//           `SUM(CASE WHEN player.status = :lossStatus THEN 1 ELSE 0 END)`,
//           'lossesCount',
//         )
//         .addSelect(
//           `SUM(CASE WHEN player.status = :drawStatus THEN 1 ELSE 0 END)`,
//           'drawsCount',
//         )
//         .setParameters({
//           winStatus: PlayerStatus.WIN,
//           lossStatus: PlayerStatus.LOSS,
//           drawStatus: PlayerStatus.DRAW,
//         })
//         .groupBy('user.id, user.login') // Группируем по полям пользователя
//         // .orderBy(sortField[0], 'DESC') // Применяем сортировку
//         // .addOrderBy(sortField[1], 'DESC') // Вторая сортировка
//         .skip((Number(pageNumber) - 1) * Number(pageSize)) // Применяем смещение для пагинации
//         .take(Number(pageSize));
//
//       const players: ITop[] = await queryBuilder.getRawMany();
//
//       console.log('players', players.length, players);
//
//       const playerList = players.map((player) => TopStatisticDtoMapper(player));
//
//       return TopOutputPaginationDtoMapper(
//         playerList,
//         players.length,
//         Number(pageSize),
//         Number(pageNumber),
//       );
//     } catch (error) {
//       console.error('Database query failed while fetching player statistics', {
//         error: (error as Error).message,
//       });
//       throw new InternalServerErrorException(
//         'Database query failed while fetching player statistics',
//       );
//     }
//   }
// }

@Injectable()
export class PlayerQueryRepository {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  public async getTop(query: TopQueryDto): Promise<any> {
    try {
      const { sort, pageNumber = 1, pageSize = 10 } = query;

      // Задаем стандартную сортировку
      const defaultSort = ['"avgScores" DESC', '"sumScore" DESC'];
      const sortField = sort?.length ? sort : defaultSort;

      const pageNumberSafe = Math.max(1, Number(pageNumber));
      const pageSizeSafe = Math.max(1, Number(pageSize));

      const queryBuilder = this.playerRepository
        .createQueryBuilder('player')
        .leftJoinAndSelect('player.user', 'user')
        .select('user.id', 'userId')
        .addSelect('user.login', 'userLogin')
        .addSelect('COUNT(player.id)', 'gamesCount')
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
        .setParameters({
          winStatus: PlayerStatus.WIN,
          lossStatus: PlayerStatus.LOSS,
          drawStatus: PlayerStatus.DRAW,
        })
        .groupBy('user.id, user.login');

      // Обрабатываем параметры сортировки
      sortField.forEach((field) => {
        const [column, order] = field.split(' ');
        queryBuilder.addOrderBy(
          `"${column}"`,
          order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        );
      });

      const totalPlayers = await queryBuilder.getCount(); // Для пагинации
      console.log('pageSizeSafe', pageSizeSafe);
      const players: ITop[] = await queryBuilder
        .skip((pageNumberSafe - 1) * pageSizeSafe)
        .take(pageSizeSafe)
        .getRawMany();

      const playerList = players.map((player) => TopStatisticDtoMapper(player));

      return TopOutputPaginationDtoMapper(
        playerList,
        totalPlayers, // Общее количество игроков для пагинации
        pageSizeSafe,
        pageNumberSafe,
      );
    } catch (error) {
      console.error('Database query failed while fetching player statistics', {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw new InternalServerErrorException(
        'Database query failed while fetching player statistics',
      );
    }
  }
}
