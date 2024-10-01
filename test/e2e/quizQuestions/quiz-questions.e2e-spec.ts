import { APP_PREFIX } from '@settings/apply-app-setting';
import request from 'supertest';
import { apiSettings, app } from '../../jest.setup';
import {  HttpStatus } from '@nestjs/common';
import { createAuthorizationHeader } from '../../utils/test-helpers';
import { testSeeder } from '../../utils/test.seeder';
import { dataSetNewQuestions1, errorDataSet1 } from './dataset';


describe(`Endpoint (POST) - /sa/quiz/questions`, () => {
  it('Should create question', async () => {

    const question = testSeeder.createQuestionDto()

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
        updatedAt: expect.any(String)
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

