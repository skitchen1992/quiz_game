import { MigrationInterface, QueryRunner } from "typeorm";

export class Answer1729072385711 implements MigrationInterface {
    name = 'Answer1729072385711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "pair_created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "pair_created_at" TIMESTAMP WITH TIME ZONE`);
    }

}
