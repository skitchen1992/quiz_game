import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/app.module';
import { applyAppSettings } from '@settings/apply-app-setting';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { APISettings } from '@settings/api-settings';
import { EnvironmentSettings } from '@settings/env-settings';
import { HashBuilder } from '@utils/hash-builder';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { DataSource, Repository } from 'typeorm';
import { SharedService } from '@infrastructure/servises/shared/shared.service';
import { QuizQuestion } from '@features/quizQuestions/domain/quizQuestions.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export let app: INestApplication;
export let dataSource: DataSource;
export let quizQuestionRepository: Repository<QuizQuestion>;

export let apiSettings: APISettings;
export let environmentSettings: EnvironmentSettings;

export const hashBuilder = new HashBuilder();
export const jwtService = new JwtService();

let sharedService: SharedService;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  sharedService = moduleFixture.get<SharedService>(SharedService);

  jest
    .spyOn(sharedService, 'sendRegisterEmail')
    .mockImplementation(async () => {
      return Promise.resolve();
    });

  jest
    .spyOn(sharedService, 'sendRecoveryPassEmail')
    .mockImplementation(async () => {
      return Promise.resolve();
    });

  app = moduleFixture.createNestApplication();

  const configService = app.get(ConfigService<ConfigurationType, true>);

  apiSettings = configService.get('apiSettings', { infer: true });
  environmentSettings = configService.get('environmentSettings', {
    infer: true,
  });

  applyAppSettings(app);
  dataSource = moduleFixture.get<DataSource>(DataSource);
  quizQuestionRepository = moduleFixture.get<Repository<QuizQuestion>>(
    getRepositoryToken(QuizQuestion),
  );

  await app.init();
});

beforeEach(async () => {
  const tables = await dataSource.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

  // Извлекаем имена таблиц
  const tableNames = tables.map(
    (table: { table_name: string }) => table.table_name,
  );

  // Очищаем все таблицы
  if (tableNames.length > 0) {
    await dataSource.query(
      `TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE`,
    );
  }
});

afterAll(async () => {
  await app.close();
  console.log('Closed successfully.');
});
