import { MigrationInterface, QueryRunner } from 'typeorm';

export class Game1728725573905 implements MigrationInterface {
  name = 'Game1728725573905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "started_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "finished_at" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "finished_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "started_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
  }
}
