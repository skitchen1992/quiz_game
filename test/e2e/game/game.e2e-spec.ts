import { APP_PREFIX } from '@settings/apply-app-setting';
import request from 'supertest';
import { apiSettings, app, quizQuestionRepository } from '../../jest.setup';
import {
  dataSet3AnswersCorrect,
  dataSetAllAnswersCorrect,
  dataSetAnswers,
  dataSetQuestions,
} from './dataset';
import { HttpStatus } from '@nestjs/common';
import { testSeeder } from '../../utils/test.seeder';
import {
  addDataToFile,
  clearFile,
  createAuthorizationHeader,
  createBearerAuthorizationHeader,
  readFileSync,
  TOKEN_PATH,
} from '../../utils/test-helpers';
import { LoginOutputDto } from '@features/auth/api/dto/output/login.output.dto';
import { sleep } from '@utils/utils';

describe.skip(`Endpoint (POST) - /pair-game-quiz/pairs/connection`, () => {
  it('Create game', async () => {
    //Создаем вопросы
    for (const question of dataSetQuestions) {
      const newQuestion = quizQuestionRepository.create({
        body: question.body,
        correct_answers: JSON.stringify(question.correctAnswers),
        published: true,
        created_at: new Date(),
        updated_at: null,
      });

      await quizQuestionRepository.save(newQuestion);
    }

    const userList = testSeeder.createUserListDto(4);

    //Создаем users
    for (const user of userList) {
      await request(app.getHttpServer())
        .post(`${APP_PREFIX}/auth/registration`)
        .send({
          login: user.login,
          password: user.password,
          email: user.email,
        })
        .expect(HttpStatus.NO_CONTENT);
    }

    //Получаем токены в файл tokens.json
    for (const user of userList) {
      const response = await request(app.getHttpServer())
        .post(`${APP_PREFIX}/auth/login`)
        .set(
          createAuthorizationHeader(
            apiSettings.ADMIN_AUTH_USERNAME,
            apiSettings.ADMIN_AUTH_PASSWORD,
          ),
        )
        .send({
          loginOrEmail: user.login,
          password: user.password,
        })
        .expect(HttpStatus.OK);

      addDataToFile(TOKEN_PATH, response.body);
    }

    const tokenList: LoginOutputDto[] = readFileSync(TOKEN_PATH);

    for (let i = 0; i < 4; i++) {
      await request(app.getHttpServer())
        .post(`${APP_PREFIX}/pair-game-quiz/pairs/connection`)
        .set(createBearerAuthorizationHeader(tokenList[0].accessToken))
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post(`${APP_PREFIX}/pair-game-quiz/pairs/connection`)
        .set(createBearerAuthorizationHeader(tokenList[1].accessToken))
        .expect(HttpStatus.OK);

      for (const answer of dataSetAnswers) {
        await request(app.getHttpServer())
          .post(`${APP_PREFIX}/pair-game-quiz/pairs/my-current/answers`)
          .set(createBearerAuthorizationHeader(tokenList[0].accessToken))
          .send({
            answer: answer.answer,
          })
          .expect(HttpStatus.OK);
      }

      for (const answer of dataSetAnswers) {
        await request(app.getHttpServer())
          .post(`${APP_PREFIX}/pair-game-quiz/pairs/my-current/answers`)
          .set(createBearerAuthorizationHeader(tokenList[1].accessToken))
          .send({
            answer: answer.answer,
          })
          .expect(HttpStatus.OK);
      }
    }
  });
});

describe(`Finish game after 10 sec.`, () => {
  it('Create game', async () => {
    clearFile(TOKEN_PATH);
    //Создаем вопросы
    for (const question of dataSetQuestions) {
      const newQuestion = quizQuestionRepository.create({
        body: question.body,
        correct_answers: JSON.stringify(question.correctAnswers),
        published: true,
        created_at: new Date(),
        updated_at: null,
      });

      await quizQuestionRepository.save(newQuestion);
    }

    const userList = testSeeder.createUserListDto(2);

    //Создаем users
    for (const user of userList) {
      await request(app.getHttpServer())
        .post(`${APP_PREFIX}/auth/registration`)
        .send({
          login: user.login,
          password: user.password,
          email: user.email,
        })
        .expect(HttpStatus.NO_CONTENT);
    }

    //Получаем токены в файл tokens.json
    for (const user of userList) {
      const response = await request(app.getHttpServer())
        .post(`${APP_PREFIX}/auth/login`)
        .set(
          createAuthorizationHeader(
            apiSettings.ADMIN_AUTH_USERNAME,
            apiSettings.ADMIN_AUTH_PASSWORD,
          ),
        )
        .send({
          loginOrEmail: user.login,
          password: user.password,
        })
        .expect(HttpStatus.OK);

      addDataToFile(TOKEN_PATH, response.body);
    }

    const tokenList: LoginOutputDto[] = readFileSync(TOKEN_PATH);

    for (let i = 0; i < 4; i++) {
      await request(app.getHttpServer())
        .post(`${APP_PREFIX}/pair-game-quiz/pairs/connection`)
        .set(createBearerAuthorizationHeader(tokenList[0].accessToken))
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post(`${APP_PREFIX}/pair-game-quiz/pairs/connection`)
        .set(createBearerAuthorizationHeader(tokenList[1].accessToken))
        .expect(HttpStatus.OK);

      for (const answer of dataSetAllAnswersCorrect) {
        await request(app.getHttpServer())
          .post(`${APP_PREFIX}/pair-game-quiz/pairs/my-current/answers`)
          .set(createBearerAuthorizationHeader(tokenList[0].accessToken))
          .send({
            answer: answer.answer,
          })
          .expect(HttpStatus.OK);
      }

      for (const answer of dataSet3AnswersCorrect) {
        await request(app.getHttpServer())
          .post(`${APP_PREFIX}/pair-game-quiz/pairs/my-current/answers`)
          .set(createBearerAuthorizationHeader(tokenList[1].accessToken))
          .send({
            answer: answer.answer,
          })
          .expect(HttpStatus.OK);
      }

      await sleep(10000);

      const response = await request(app.getHttpServer())
        .get(`${APP_PREFIX}/pair-game-quiz/pairs/my-current`)
        .set(createBearerAuthorizationHeader(tokenList[0].accessToken))
        .expect(HttpStatus.OK);

      expect(response.body.firstPlayerProgress.score).toBe(6);
    }
  });
});
