import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogs1772399271593 implements MigrationInterface {
    name = 'CreateAuditLogs1772399271593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event" character varying NOT NULL, "entity_id" character varying NOT NULL, "entity_name" character varying NOT NULL, "entity_before" text NOT NULL, "entity_after" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
