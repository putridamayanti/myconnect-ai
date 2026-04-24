import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttendeeTable1777030000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attendees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid, "name" character varying NOT NULL, "headline" character varying NOT NULL, "bio" text NOT NULL, "company" character varying NOT NULL, "role" character varying NOT NULL, "skills" text array NOT NULL, "looking_for" text NOT NULL, "open_to_chat" boolean NOT NULL DEFAULT true, "embedding" vector, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_attendees" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attendees" ADD CONSTRAINT "FK_attendees_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendees" DROP CONSTRAINT "FK_attendees_event"`);
        await queryRunner.query(`DROP TABLE "attendees"`);
    }
}
