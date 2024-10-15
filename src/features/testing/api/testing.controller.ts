import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@SkipThrottle()
@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete() {
    // Получаем все таблицы в базе данных
    const tables = await this.dataSource.query(`
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
      await this.dataSource.query(
        `TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE`,
      );
    }
  }
}
