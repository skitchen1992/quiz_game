import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { BearerAuthGuard } from '@infrastructure/guards/bearer-auth-guard.service';
import { Request } from 'express';
import { AnswerDto } from '@features/pairQuizGame/api/dto/input/create-blog.input.dto';
import { GameService } from '@features/pairQuizGame/application/game.service';

@SkipThrottle()
@ApiTags('PairQuizGame')
@Controller('pair-game-quiz')
@ApiSecurity('bearer')
@UseGuards(BearerAuthGuard)
export class PairQuizGameController {
  constructor(private readonly gameService: GameService) {}

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Post('pairs/connection')
  async connection(@Req() request: Request) {
    const user = request.currentUser!;

    return this.gameService.handleConnection(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Get('pairs/my-current')
  async currentGame(@Req() request: Request) {
    const user = request.currentUser!;

    return this.gameService.getCurrentGame(user.id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Get('pairs/my')
  async myGames(@Req() request: Request) {
    const user = request.currentUser!;

    return this.gameService.getAllGames(user.id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Get('pairs/:gameId')
  async getGameById(
    @Req() request: Request,
    @Param('gameId', ParseUUIDPipe) gameId: string,
  ) {
    const user = request.currentUser!;

    return this.gameService.getGameById(user.id, gameId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Post('pairs/my-current/answers')
  async answers(@Req() request: Request, @Body() input: AnswerDto) {
    const user = request.currentUser!;

    return this.gameService.handlePlayerAnswer(user, input);
  }

  @HttpCode(HttpStatus.OK)
  @ApiSecurity('bearer')
  @UseGuards(BearerAuthGuard)
  @Get('users/my-statistic')
  async myStatistic(@Req() request: Request) {
    const user = request.currentUser!;

    return this.gameService.getStatistic(user.id);
  }
}
