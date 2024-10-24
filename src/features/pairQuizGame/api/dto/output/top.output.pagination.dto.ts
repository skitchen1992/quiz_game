import { getPageCount } from '@utils/pagination';
import { rounded } from '@utils/utils';

interface IPlayer {
  id: string;
  login: string;
}
export interface ITopStatistic {
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

export const TopStatisticDtoMapper = (
  top: ITopStatistic,
): TopStatisticOutputDto => {
  const outputDto = new TopStatisticOutputDto();

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
