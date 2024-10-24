import { getPageCount } from '@utils/pagination';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectionOutputDto } from '@features/pairQuizGame/api/dto/output/connection.output.dto';
import { rounded } from '@utils/utils';
import {
  IStatistic,
  MyStatisticOutputDto,
} from '@features/pairQuizGame/api/dto/output/my-statistic.output.dto';
import { Player } from '@features/pairQuizGame/domain/player.entity';

interface IPlayer {
  id: string;
  login: string;
}
export interface ITop {
  gamesCount: string | null;
  sumScore: string | null;
  avgScores: string | null;
  winsCount: string | null;
  lossesCount: string | null;
  drawsCount: string | null;
  userId: string;
  userLogin: string;
}
export class TopStatisticOutputDto {
  gamesCount: number;
  sumScore: number;
  avgScores: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
  player: IPlayer;
}

export class TopOutputPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: TopStatisticOutputDto[];
}

// MAPPERS

export const TopStatisticDtoMapper = (top: ITop): TopStatisticOutputDto => {
  const outputDto = new TopStatisticOutputDto();

  // outputDto.gamesCount = Number(statistic?.gamesCount);
  // outputDto.sumScore = Number(statistic?.sumScore);
  // outputDto.avgScores = rounded(Number(statistic?.avgScores));
  // outputDto.winsCount = Number(statistic?.winsCount);
  // outputDto.lossesCount = Number(statistic?.lossesCount);
  // outputDto.drawsCount = Number(statistic?.drawsCount);
  // outputDto.player = { id: '1', login: 'login' };

  outputDto.sumScore = Number(top.sumScore);
  outputDto.avgScores = rounded(Number(top?.avgScores));
  outputDto.gamesCount = Number(top.gamesCount);
  outputDto.winsCount = Number(top.winsCount);
  outputDto.lossesCount = Number(top.lossesCount);
  outputDto.drawsCount = Number(top.drawsCount);
  outputDto.player = {
    id: top.userId,
    login: top.userLogin,
  };

  return outputDto;
};

export const TopOutputPaginationDtoMapper = (
  top: TopStatisticOutputDto[],
  totalCount: number,
  pageSize: number,
  page: number,
): TopOutputPaginationDto => {
  const outputDto = new TopOutputPaginationDto();

  outputDto.pagesCount = getPageCount(totalCount, pageSize);
  outputDto.page = page;
  outputDto.pageSize = pageSize;
  outputDto.totalCount = totalCount;
  outputDto.items = top;

  return outputDto;
};
