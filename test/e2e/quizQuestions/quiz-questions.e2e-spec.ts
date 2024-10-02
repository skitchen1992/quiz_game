import { APP_PREFIX } from '@settings/apply-app-setting';
import request from 'supertest';
import { apiSettings, app, quizQuestionRepository } from '../../jest.setup';
import { HttpStatus } from '@nestjs/common';
import { createAuthorizationHeader } from '../../utils/test-helpers';
import { testSeeder } from '../../utils/test.seeder';
import {
  dataSetNewQuestions1,
  dataSetNewQuestions2,
  errorDataSet1,
} from './dataset';
import { ID } from '../../mocks/mocks';

describe(`Endpoint (POST) - /sa/quiz/questions`, () => {
  it('Should create question', async () => {
    const question = testSeeder.createQuestionDto();

    const res = await request(app.getHttpServer())
      .post(`${APP_PREFIX}/sa/quiz/questions`)
      .set(
        createAuthorizationHeader(
          apiSettings.ADMIN_AUTH_USERNAME,
          apiSettings.ADMIN_AUTH_PASSWORD,
        ),
      )
      .send(question)
      .expect(HttpStatus.CREATED);

    expect(res.body).toEqual(
      expect.objectContaining({
        ...question,
        id: expect.any(String),
        published: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it(`Should get ${HttpStatus.BAD_REQUEST} `, async () => {
    const res = await request(app.getHttpServer())
      .post(`${APP_PREFIX}/sa/quiz/questions`)
      .set(
        createAuthorizationHeader(
          apiSettings.ADMIN_AUTH_USERNAME,
          apiSettings.ADMIN_AUTH_PASSWORD,
        ),
      )
      .send(dataSetNewQuestions1)
      .expect(HttpStatus.BAD_REQUEST);

    expect(res.body).toEqual(errorDataSet1);
  });

  it(`Should get ${HttpStatus.UNAUTHORIZED} `, async () => {
    await request(app.getHttpServer())
      .post(`${APP_PREFIX}/sa/quiz/questions`)
      .send(dataSetNewQuestions1)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});

describe(`Endpoint (DELETE) - /sa/quiz/questions`, () => {
  it('Should delete question', async () => {
    const newQuestion = testSeeder.createQuestionDto();

    const question = quizQuestionRepository.create({
      body: newQuestion.body,
      correct_answers: JSON.stringify(newQuestion.correctAnswers),
      published: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedQuestion = await quizQuestionRepository.save(question);

    await request(app.getHttpServer())
      .delete(`${APP_PREFIX}/sa/quiz/questions/${savedQuestion.id}`)
      .set(
        createAuthorizationHeader(
          apiSettings.ADMIN_AUTH_USERNAME,
          apiSettings.ADMIN_AUTH_PASSWORD,
        ),
      )
      .expect(HttpStatus.NO_CONTENT);
  });

  it(`Should get ${HttpStatus.NOT_FOUND} `, async () => {
    await request(app.getHttpServer())
      .delete(`${APP_PREFIX}/sa/quiz/questions/${ID}`)
      .set(
        createAuthorizationHeader(
          apiSettings.ADMIN_AUTH_USERNAME,
          apiSettings.ADMIN_AUTH_PASSWORD,
        ),
      )
      .expect(HttpStatus.NOT_FOUND);
  });

  it(`Should get ${HttpStatus.UNAUTHORIZED} `, async () => {
    await request(app.getHttpServer())
      .delete(`${APP_PREFIX}/sa/quiz/questions/${ID}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});

describe(`Endpoint (PUT) - /sa/quiz/questions`, () => {
  it('Should update question', async () => {
    const newQuestion = testSeeder.createQuestionDto();

    const question = quizQuestionRepository.create({
      body: newQuestion.body,
      correct_answers: JSON.stringify(newQuestion.correctAnswers),
      published: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedQuestion = await quizQuestionRepository.save(question);

    await request(app.getHttpServer())
      .put(`${APP_PREFIX}/sa/quiz/questions/${savedQuestion.id}`)
      .set(
        createAuthorizationHeader(
          apiSettings.ADMIN_AUTH_USERNAME,
          apiSettings.ADMIN_AUTH_PASSWORD,
        ),
      )
      .send(dataSetNewQuestions2)
      .expect(HttpStatus.NO_CONTENT);
  });

  it(`Should get ${HttpStatus.NOT_FOUND} `, async () => {
    await request(app.getHttpServer())
      .put(`${APP_PREFIX}/sa/quiz/questions/${ID}`)
      .set(
        createAuthorizationHeader(
          apiSettings.ADMIN_AUTH_USERNAME,
          apiSettings.ADMIN_AUTH_PASSWORD,
        ),
      )
      .send(dataSetNewQuestions2)
      .expect(HttpStatus.NOT_FOUND);
  });

  it(`Should get ${HttpStatus.BAD_REQUEST} `, async () => {
    await request(app.getHttpServer())
      .put(`${APP_PREFIX}/sa/quiz/questions/${ID}`)
      .set(
        createAuthorizationHeader(
          apiSettings.ADMIN_AUTH_USERNAME,
          apiSettings.ADMIN_AUTH_PASSWORD,
        ),
      )
      .expect(HttpStatus.BAD_REQUEST);
  });

  it(`Should get ${HttpStatus.UNAUTHORIZED} `, async () => {
    await request(app.getHttpServer())
      .put(`${APP_PREFIX}/sa/quiz/questions/${ID}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
