import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728453410618 implements MigrationInterface {
    name = 'QuizGame1728453410618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_c853376060f9557f9a48d214dd5"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "first_player_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_c853376060f9557f9a48d214dd5" FOREIGN KEY ("first_player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_c853376060f9557f9a48d214dd5"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "first_player_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_c853376060f9557f9a48d214dd5" FOREIGN KEY ("first_player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
