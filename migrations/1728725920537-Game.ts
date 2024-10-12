import { MigrationInterface, QueryRunner } from "typeorm";

export class Game1728725920537 implements MigrationInterface {
    name = 'Game1728725920537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "pair_created_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "pair_created_at"`);
    }

}
