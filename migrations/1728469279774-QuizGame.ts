import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728469279774 implements MigrationInterface {
    name = 'QuizGame1728469279774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_d04e64fc9b7fd372000c0dfda3f"`);
        await queryRunner.query(`ALTER TABLE "player" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_d04e64fc9b7fd372000c0dfda3f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_d04e64fc9b7fd372000c0dfda3f"`);
        await queryRunner.query(`ALTER TABLE "player" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_d04e64fc9b7fd372000c0dfda3f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}