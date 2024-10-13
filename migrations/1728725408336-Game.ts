import { MigrationInterface, QueryRunner } from 'typeorm';

export class Game1728725408336 implements MigrationInterface {
  name = 'Game1728725408336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ADD "started_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD "finished_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "finished_at"`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "started_at"`);
  }
}
