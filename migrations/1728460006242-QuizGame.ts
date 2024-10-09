import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1728460006242 implements MigrationInterface {
    name = 'QuizGame1728460006242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question_of_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`);
    }

}
