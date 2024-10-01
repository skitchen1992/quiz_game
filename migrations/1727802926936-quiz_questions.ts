import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizQuestions1727802926936 implements MigrationInterface {
    name = 'QuizQuestions1727802926936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "updated_at" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "updated_at" DROP NOT NULL`);
    }

}
