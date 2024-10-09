import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728454672343 implements MigrationInterface {
    name = 'QuizGame1728454672343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5c486122f6925ef0e8fefd5fc75"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_433f544c592c2b6cbdfd2edbec3"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "playerId"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "questionId"`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "game_id"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "question_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "player_id" uuid`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_d0606a27b8946f66e26b29857bc" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_d0606a27b8946f66e26b29857bc"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "player_id"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "question_id"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "game_id" uuid`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "questionId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "playerId" uuid`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_433f544c592c2b6cbdfd2edbec3" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5c486122f6925ef0e8fefd5fc75" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
