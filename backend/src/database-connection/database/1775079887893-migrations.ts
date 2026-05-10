import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775079887893 implements MigrationInterface {
    name = 'Migrations1775079887893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "priority" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pendiente', "orderInStatus" integer NOT NULL DEFAULT '0', "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(50) NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL, "gender" character varying NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
