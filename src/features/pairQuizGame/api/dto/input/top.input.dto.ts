import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class TopQueryDto {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Преобразуем строку в массив
  @Matches(
    /^(avgScores|sumScore|gamesCount|winsCount|lossesCount|drawsCount)\s+(asc|desc)$/i,
    {
      each: true,
      message: 'Sort must be in format: field direction (e.g., avgScores desc)',
    },
  )
  sort?: string[];

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
