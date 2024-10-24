import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Player,
  PlayerStatus,
} from '@features/pairQuizGame/domain/player.entity';
import { TopQueryDto } from '@features/pairQuizGame/api/dto/input/top.input.dto';
import {
  ITopStatistic,
  TopOutputPaginationDtoMapper,
  TopStatisticDtoMapper,
} from '@features/pairQuizGame/api/dto/output/top.output.pagination.dto';

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

      // 1. Запрос для подсчета уникальных пользователей (user.id)
      const totalCountQueryBuilder = this.playerRepository
        .createQueryBuilder('player')
        .leftJoin('player.user', 'user')
        .select('COUNT(DISTINCT user.id)', 'totalCount')
        .setParameters({
          winStatus: PlayerStatus.WIN,
          lossStatus: PlayerStatus.LOSS,
          drawStatus: PlayerStatus.DRAW,
        });

      const totalCountResult = await totalCountQueryBuilder.getRawOne();
      const totalCount = parseInt(totalCountResult.totalCount, 10);

      // 2. Основной запрос для получения данных с пагинацией
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

      //const totalCount = await queryBuilder.getCount(); // Для пагинации

      const topStatistic: ITopStatistic[] = await queryBuilder
        .limit(pageSizeSafe) // Альтернатива .take(pageSizeSafe)
        .offset((pageNumberSafe - 1) * pageSizeSafe)
        .getRawMany();

      const topStatisticList = topStatistic.map((player) =>
        TopStatisticDtoMapper(player),
      );

      return TopOutputPaginationDtoMapper(
        topStatisticList,
        totalCount,
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
