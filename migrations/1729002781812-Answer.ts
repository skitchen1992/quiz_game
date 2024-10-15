import { MigrationInterface, QueryRunner } from "typeorm";

export class Answer1729002781812 implements MigrationInterface {
    name = 'Answer1729002781812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_confirmation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "is_confirmed" boolean NOT NULL DEFAULT false, "confirmation_code" character varying NOT NULL, "expiration_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "REL_857e9c1f08bc0a9f5010162183" UNIQUE ("user_id"), CONSTRAINT "PK_ff2b80a46c3992a0046b07c5456" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "ip" character varying(255) NOT NULL, "title" character varying(255) NOT NULL, "last_active_date" TIMESTAMP WITH TIME ZONE NOT NULL, "token_issue_date" TIMESTAMP WITH TIME ZONE NOT NULL, "token_expiration_date" TIMESTAMP WITH TIME ZONE NOT NULL, "device_id" uuid NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(15) COLLATE "C" NOT NULL, "description" character varying(500) NOT NULL, "website_url" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_membership" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(30) NOT NULL, "short_description" character varying(100) NOT NULL, "content" character varying(1000) NOT NULL, "blog_id" uuid NOT NULL, "blog_name" character varying COLLATE "C" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(300) NOT NULL, "user_id" uuid NOT NULL, "user_login" character varying(255) COLLATE "C" NOT NULL, "post_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" character varying(10) NOT NULL DEFAULT 'None', "author_id" uuid NOT NULL, "parent_id" uuid NOT NULL, "parent_type" character varying(10) NOT NULL, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying COLLATE "C" NOT NULL, "correct_answers" jsonb NOT NULL, "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_ec0447fd30d9f5c182e7653bfd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."game_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE, "pair_created_at" TIMESTAMP WITH TIME ZONE, "started_at" TIMESTAMP WITH TIME ZONE, "finished_at" TIMESTAMP WITH TIME ZONE, "first_player_id" uuid NOT NULL, "second_player_id" uuid, CONSTRAINT "REL_c853376060f9557f9a48d214dd" UNIQUE ("first_player_id"), CONSTRAINT "REL_4b8c0b7cf035c27f6a470234a0" UNIQUE ("second_player_id"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_of_game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "question_id" uuid NOT NULL, "game_id" uuid NOT NULL, CONSTRAINT "UQ_e9f15ed52b7ad0baaa903233977" UNIQUE ("question_id"), CONSTRAINT "PK_b6cdb737a6fcfe3727afd1f1c86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "status" "public"."answer_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "question_id" uuid NOT NULL, "player_id" uuid NOT NULL, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "score" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."player_status_enum" NOT NULL DEFAULT 'in_progress', CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(10) COLLATE "C" NOT NULL, "password" character varying NOT NULL, "email" character varying COLLATE "C" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recovery_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "confirmation_code" character varying NOT NULL, "is_confirmed" boolean NOT NULL, CONSTRAINT "REL_f5c95d9ca2047afa670093e202" UNIQUE ("user_id"), CONSTRAINT "PK_b7f1e23329e93a80e25fd281922" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_confirmation" ADD CONSTRAINT "FK_857e9c1f08bc0a9f50101621833" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_7689491fe4377a8090576a799a0" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_11f930ef5675078349464caba56" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_c853376060f9557f9a48d214dd5" FOREIGN KEY ("first_player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_4b8c0b7cf035c27f6a470234a02" FOREIGN KEY ("second_player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_of_game" ADD CONSTRAINT "FK_6a8841d07f394c1517dd66f392e" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question_of_game"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_d0606a27b8946f66e26b29857bc" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_d04e64fc9b7fd372000c0dfda3f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recovery_code" ADD CONSTRAINT "FK_f5c95d9ca2047afa670093e2028" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery_code" DROP CONSTRAINT "FK_f5c95d9ca2047afa670093e2028"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_d04e64fc9b7fd372000c0dfda3f"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_d0606a27b8946f66e26b29857bc"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_6a8841d07f394c1517dd66f392e"`);
        await queryRunner.query(`ALTER TABLE "question_of_game" DROP CONSTRAINT "FK_e9f15ed52b7ad0baaa903233977"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_4b8c0b7cf035c27f6a470234a02"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_c853376060f9557f9a48d214dd5"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_11f930ef5675078349464caba56"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_7689491fe4377a8090576a799a0"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation" DROP CONSTRAINT "FK_857e9c1f08bc0a9f50101621833"`);
        await queryRunner.query(`DROP TABLE "recovery_code"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "question_of_game"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "email_confirmation"`);
    }

}
