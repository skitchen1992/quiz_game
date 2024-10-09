import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728460294097 implements MigrationInterface {
    name = 'QuizGame1728460294097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_6a8841d07f394c1517dd66f392e"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "game_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_d0606a27b8946f66e26b29857bc"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "player_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_6a8841d07f394c1517dd66f392e" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_d0606a27b8946f66e26b29857bc" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_d0606a27b8946f66e26b29857bc"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_6a8841d07f394c1517dd66f392e"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "player_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_d0606a27b8946f66e26b29857bc" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "game_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_6a8841d07f394c1517dd66f392e" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
