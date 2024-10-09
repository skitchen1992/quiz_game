import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728459603722 implements MigrationInterface {
    name = 'QuizGame1728459603722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_2df0b0d7a557f39f1833d0bd8da"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP COLUMN "gameId"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "game_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_6a8841d07f394c1517dd66f392e" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_6a8841d07f394c1517dd66f392e"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "game_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD "gameId" uuid`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_2df0b0d7a557f39f1833d0bd8da" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
