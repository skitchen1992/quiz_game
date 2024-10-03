import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '@infrastructure/guards/basic-auth-guard.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateQuestionInputDto } from '@features/quizQuestions/api/dto/input/create-question.input.dto';
import { CreateQuestionCommand } from '@features/quizQuestions/application/handlers/create-question.handler';
import { GetQuestionQuery } from '@features/quizQuestions/application/handlers/get-question.handler';
import { QuestionOutputDto } from '@features/quizQuestions/api/dto/output/question.output.dto';
import { DeleteQuestionCommand } from '@features/quizQuestions/application/handlers/delete-question.handler';
import { UpdatePostForBlogDto } from '@features/blogs/api/dto/input/update-post-for-blog.input.dto';
import { UpdatePostCommand } from '@features/posts/application/handlers/update-post.handler';
import { UpdateQuestionInputDto } from '@features/quizQuestions/api/dto/input/update-question.input.dto';
import { UpdateQuestionCommand } from '@features/quizQuestions/application/handlers/update-question.handler';
import { PublishQuestionInputDto } from '@features/quizQuestions/api/dto/input/publish-question.input.dto';
import { PublishQuestionCommand } from '@features/quizQuestions/application/handlers/publish-question.handler';
import { QuestionsQueryDto } from '@features/quizQuestions/api/dto/input/get-pagination-question.input.dto';
import { QuestionsOutputPaginationDto } from '@features/quizQuestions/api/dto/output/get-pagination-question.output.dto';
import { GetAllQuestionsQuery } from '@features/quizQuestions/application/handlers/get-all-questions.handler';

@SkipThrottle()
@ApiTags('QuizQuestions')
@Controller('sa/quiz/questions')
@ApiSecurity('basic')
@UseGuards(BasicAuthGuard)
export class QuizQuestionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(@Query() query: QuestionsQueryDto) {
    return await this.queryBus.execute<
      GetAllQuestionsQuery,
      QuestionsOutputPaginationDto
    >(new GetAllQuestionsQuery(query));
  }

  @Post()
  async create(@Body() input: CreateQuestionInputDto) {
    const { body, correctAnswers } = input;

    const createdQuestionId: string = await this.commandBus.execute<
      CreateQuestionCommand,
      string
    >(new CreateQuestionCommand(body, correctAnswers));

    return await this.queryBus.execute<GetQuestionQuery, QuestionOutputDto>(
      new GetQuestionQuery(createdQuestionId),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.commandBus.execute<DeleteQuestionCommand, void>(
      new DeleteQuestionCommand(id),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') answerId: string,
    @Body() input: UpdateQuestionInputDto,
  ) {
    const { body, correctAnswers } = input;

    await this.commandBus.execute<UpdateQuestionCommand, void>(
      new UpdateQuestionCommand(body, correctAnswers, answerId),
    );
  }

  @Put(':id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async publish(
    @Param('id') answerId: string,
    @Body() input: PublishQuestionInputDto,
  ) {
    const { published } = input;

    await this.commandBus.execute<PublishQuestionCommand, void>(
      new PublishQuestionCommand(answerId, published),
    );
  }
}
