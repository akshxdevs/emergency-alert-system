/*
  Warnings:

  - The values [REPORT,IN_PROCRESS] on the enum `StatusReport` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusReport_new" AS ENUM ('REPORTED', 'IN_PROCESS', 'RESOLVED');
ALTER TABLE "Emergency" ALTER COLUMN "status" TYPE "StatusReport_new" USING ("status"::text::"StatusReport_new");
ALTER TYPE "StatusReport" RENAME TO "StatusReport_old";
ALTER TYPE "StatusReport_new" RENAME TO "StatusReport";
DROP TYPE "StatusReport_old";
COMMIT;
