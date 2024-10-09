import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728459392106 implements MigrationInterface {
    name = 'QuizGame1728459392106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "question_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "UQ_e9f15ed52b7ad0baaa903233977" UNIQUE ("question_id")`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "UQ_e9f15ed52b7ad0baaa903233977"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "question_id" SET NOT NULL`);
    }

}
