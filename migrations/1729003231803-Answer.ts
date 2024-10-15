import { MigrationInterface, QueryRunner } from "typeorm";

export class Answer1729003231803 implements MigrationInterface {
    name = 'Answer1729003231803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id")`);
    }

}
