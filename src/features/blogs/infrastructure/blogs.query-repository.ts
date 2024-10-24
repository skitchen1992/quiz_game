import { Injectable } from '@nestjs/common';
import {
  BlogOutputDto,
  BlogOutputDtoMapper,
} from '../api/dto/output/blog.output.dto';
import {
  BlogOutputPaginationDto,
  BlogOutputPaginationDtoMapper,
  BlogsQuery,
} from '@features/blogs/api/dto/output/blog.output.pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '@features/blogs/domain/blog.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  public async getById(blogId: string): Promise<BlogOutputDto | null> {
    try {
      const blog = await this.blogRepository.findOneBy({ id: blogId });

      if (!blog) {
        return null;
      }

      return BlogOutputDtoMapper(blog);
    } catch (e) {
      console.error('Error during getBlogById', e);
      return null;
    }
  }

  public async getAll(query: BlogsQuery): Promise<BlogOutputPaginationDto> {
    const {
      searchNameTerm,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = query;

    const validSortDirections = ['asc', 'desc'];
    const direction = validSortDirections.includes(sortDirection)
      ? sortDirection
      : 'desc';

    const validSortFields = ['created_at', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';

    const queryBuilder = this.blogRepository.createQueryBuilder('b');

    if (searchNameTerm) {
      queryBuilder.andWhere('b.name ILIKE :searchName', {
        searchName: `%${searchNameTerm}%`,
      });
    }

    queryBuilder
      .addOrderBy(`b.${sortField}`, direction.toUpperCase() as 'ASC' | 'DESC')
      .skip((Number(pageNumber) - 1) * Number(pageSize))
      .take(Number(pageSize));

    const [blogs, totalCount] = await queryBuilder.getManyAndCount();

    const blogList = blogs.map((blog) => BlogOutputDtoMapper(blog));

    return BlogOutputPaginationDtoMapper(
      blogList,
      totalCount,
      Number(pageSize),
      Number(pageNumber),
    );
  }
}

const b = {
  pagesCount: 9,
  page: 1,
  pageSize: 3,
  totalCount: 26,
  items: [
    {
      gamesCount: 9,
      winsCount: 4,
      lossesCount: 4,
      drawsCount: 1,
      sumScore: 20,
      avgScores: 2.22,
      player: { id: '0f51667a-3852-4314-b543-057ca47bde18', login: '9024lg' },
    },
    {
      gamesCount: 3,
      winsCount: 3,
      lossesCount: 0,
      drawsCount: 0,
      sumScore: 13,
      avgScores: 4.33,
      player: { id: 'dbbc6f20-83f9-4ef2-bc4e-4c280ee5c1b8', login: '9028lg' },
    },
    {
      gamesCount: 6,
      winsCount: 3,
      lossesCount: 3,
      drawsCount: 0,
      sumScore: 13,
      avgScores: 2.17,
      player: { id: '522a706b-1fd3-470e-95fe-c3649f20df49', login: '9025lg' },
    },
  ],
};
