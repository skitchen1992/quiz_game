import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizQuestions1727803032324 implements MigrationInterface {
    name = 'QuizQuestions1727803032324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" RENAME COLUMN "bod" TO "body"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" RENAME COLUMN "body" TO "bod"`);
    }

}
