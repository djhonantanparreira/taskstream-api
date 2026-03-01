import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksAndAuditLogs1740837600000
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Habilitar pgcrypto para UUIDs
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

        // Criar enum de status
        await queryRunner.query(
            `CREATE TYPE "task_status_enum" AS ENUM ('pending', 'in_progress', 'done')`,
        );

        // Criar tabela tasks
        await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id"          uuid DEFAULT gen_random_uuid() NOT NULL,
        "title"       varchar NOT NULL,
        "description" varchar,
        "status"      "task_status_enum" NOT NULL DEFAULT 'pending',
        "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id")
      )
    `);

        // Criar tabela audit_logs
        await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id"            uuid DEFAULT gen_random_uuid() NOT NULL,
        "event"         varchar NOT NULL,
        "entity_id"     varchar NOT NULL,
        "entity_name"   varchar NOT NULL,
        "entity_before" text NOT NULL,
        "entity_after"  text NOT NULL,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);

        // Índices
        await queryRunner.query(
            `CREATE INDEX "IDX_tasks_status" ON "tasks" ("status")`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_audit_logs_entity" ON "audit_logs" ("entity_name", "entity_id")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_audit_logs_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_tasks_status"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "task_status_enum"`);
    }
}
