import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConciergeTables1777030000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" character varying NOT NULL, "attendee_id" character varying NOT NULL, "role" character varying NOT NULL, "content" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_messages" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tool_calls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message_id" character varying NOT NULL, "tool_name" character varying NOT NULL, "input" jsonb NOT NULL, "output" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_tool_calls" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tool_calls"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }
}
