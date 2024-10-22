import { rounded } from '@utils/utils';

export interface IStatistic {
  gamesCount: string | null;
  sumScore: string | null;
  avgScores: string | null;
  winsCount: string | null;
  lossesCount: string | null;
  drawsCount: string | null;
}

export class MyStatisticOutputDto {
  gamesCount: number;
  sumScore: number;
  avgScores: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
}

// MAPPERS

export const MyStatisticDtoMapper = (
  statistic?: IStatistic,
): MyStatisticOutputDto => {
  const outputDto = new MyStatisticOutputDto();

  outputDto.gamesCount = Number(statistic?.gamesCount);
  outputDto.sumScore = Number(statistic?.sumScore);
  outputDto.avgScores = rounded(Number(statistic?.avgScores));
  outputDto.winsCount = Number(statistic?.winsCount);
  outputDto.lossesCount = Number(statistic?.lossesCount);
  outputDto.drawsCount = Number(statistic?.drawsCount);

  return outputDto;
};
