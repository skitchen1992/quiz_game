import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728410204851 implements MigrationInterface {
    name = 'QuizGame1728410204851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a"`);
        await queryRunner.query(`ALTER TABLE "player" RENAME COLUMN "gameId" TO "game_id"`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_433f544c592c2b6cbdfd2edbec3" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_433f544c592c2b6cbdfd2edbec3"`);
        await queryRunner.query(`ALTER TABLE "player" RENAME COLUMN "game_id" TO "gameId"`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
