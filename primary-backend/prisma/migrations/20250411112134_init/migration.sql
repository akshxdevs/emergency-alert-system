/*
  Warnings:

  - Changed the type of `priority` on the `Emergency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Emergency" DROP COLUMN "priority",
ADD COLUMN     "priority" "PriorityLevel" NOT NULL;
