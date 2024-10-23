import { getPageCount } from '@utils/pagination';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectionOutputDto } from '@features/pairQuizGame/api/dto/output/connection.output.dto';

export class GameQuery {
  // /**
  //  * Search term for user Login: Login should contain this term in any position
  //  * Default value : null
  //  */
  // @IsOptional()
  // @IsString()
  // searchLoginTerm?: string;
  /**
   * Default value : createdAt
   */
  @IsOptional()
  @IsString()
  sortBy?: string;
  /**
   * Default value: desc
   * Available values : asc, desc
   */
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either asc or desc',
  })
  sortDirection?: 'asc' | 'desc';
  /**
   * pageNumber is number of portions that should be returned
   * Default value : 1
   */
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'pageNumber must be at least 1' })
  @Type(() => Number)
  pageNumber?: string;
  /**
   * pageSize is portions size that should be returned
   * Default value : 10
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: string;
}

export class GameOutputPaginationDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ConnectionOutputDto[];
}

// MAPPERS

export const GameOutputPaginationDtoMapper = (
  games: ConnectionOutputDto[],
  totalCount: number,
  pageSize: number,
  page: number,
): GameOutputPaginationDto => {
  const outputDto = new GameOutputPaginationDto();

  outputDto.pagesCount = getPageCount(totalCount, pageSize);
  outputDto.page = page;
  outputDto.pageSize = pageSize;
  outputDto.totalCount = totalCount;
  outputDto.items = games;

  return outputDto;
};
