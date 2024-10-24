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
      player: { id: '48ec39c7-5724-4133-a3a1-344d555b89c9', login: '5546lg' },
    },
    {
      sumScore: 13,
      avgScores: 4.33,
      gamesCount: 3,
      winsCount: 3,
      lossesCount: 0,
      drawsCount: 0,
      player: { id: '4a69455b-c43e-4482-b70a-fef86be4101b', login: '5550lg' },
    },
    {
      sumScore: 13,
      avgScores: 2.17,
      gamesCount: 6,
      winsCount: 3,
      lossesCount: 3,
      drawsCount: 0,
      player: { id: 'f6a2a104-782b-434c-9a62-d594d80fd48f', login: '5547lg' },
    },
  ],
};
