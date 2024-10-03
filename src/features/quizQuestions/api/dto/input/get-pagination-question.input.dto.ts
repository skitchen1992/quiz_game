import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Trim } from '@infrastructure/decorators/transform/trim';
import { Type } from 'class-transformer';

export class QuestionsQueryDto {
  /**
   * Search term for user Body: Body should contain this term in any position
   * Default value : null
   */
  @IsOptional()
  @IsString()
  @Trim()
  bodySearchTerm?: string;
  /**
   * Default value : all
   * Available values : all, published, notPublished
   */
  @IsOptional()
  @IsIn(['all', 'published', 'notPublished'], {
    message: 'publishedStatus must be either all or published or notPublished',
  })
  publishedStatus?: 'all' | 'published' | 'notPublished';
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
