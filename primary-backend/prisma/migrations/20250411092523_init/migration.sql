-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CIVILIAN', 'POLICE', 'FIRE', 'MEDICAL');

-- CreateEnum
CREATE TYPE "HazardType" AS ENUM ('FIRE', 'CRIME', 'ACCIDENT', 'MEDICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "StatusReport" AS ENUM ('REPORT', 'IN_PROCRESS', 'RESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "emergencyId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emergency" (
    "id" TEXT NOT NULL,
    "type" "HazardType" NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "status" "StatusReport" NOT NULL,
    "assignedTo" "UserRole" NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdatedAt" TIMESTAMP(3),
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Emergency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_emergencyId_fkey" FOREIGN KEY ("emergencyId") REFERENCES "Emergency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
