import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizQuestions1727761010273 implements MigrationInterface {
    name = 'QuizQuestions1727761010273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" RENAME COLUMN "updated_ata" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "updated_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" RENAME COLUMN "updated_at" TO "updated_ata"`);
    }

}
