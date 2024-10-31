import { MigrationInterface, QueryRunner } from 'typeorm';

export class Game1729862242354 implements MigrationInterface {
  name = 'Game1729862242354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ADD "pending_completion_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" DROP COLUMN "pending_completion_at"`,
    );
  }
}
