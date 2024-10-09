import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728471908798 implements MigrationInterface {
    name = 'QuizGame1728471908798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."player_status_enum" AS ENUM('win', 'loss', 'draw', 'in_progress')`);
        await queryRunner.query(`ALTER TABLE "player" ADD "status" "public"."player_status_enum" NOT NULL DEFAULT 'in_progress'`);
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "question_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "UQ_e9f15ed52b7ad0baaa903233977"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "UQ_e9f15ed52b7ad0baaa903233977" UNIQUE ("question_id")`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ALTER COLUMN "question_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."player_status_enum"`);
    }

}
