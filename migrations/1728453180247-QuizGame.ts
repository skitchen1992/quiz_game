import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728453180247 implements MigrationInterface {
    name = 'QuizGame1728453180247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "first_player_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_c853376060f9557f9a48d214dd5" UNIQUE ("first_player_id")`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "second_player_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_4b8c0b7cf035c27f6a470234a02" UNIQUE ("second_player_id")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_c853376060f9557f9a48d214dd5" FOREIGN KEY ("first_player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_4b8c0b7cf035c27f6a470234a02" FOREIGN KEY ("second_player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_4b8c0b7cf035c27f6a470234a02"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_c853376060f9557f9a48d214dd5"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_4b8c0b7cf035c27f6a470234a02"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "second_player_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_c853376060f9557f9a48d214dd5"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "first_player_id" SET NOT NULL`);
    }

}
