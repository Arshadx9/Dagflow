-- CreateEnum
CREATE TYPE "Status" AS ENUM ('FINISHED', 'FAILED', 'PENDING', 'RUNNING', 'RETRYING');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PAUSED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "ApiStatus" AS ENUM ('REVOKED', 'ACTIVE');

-- CreateTable
CREATE TABLE "Bizowner" (
    "ownerId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bizowner_pkey" PRIMARY KEY ("ownerId")
);

-- CreateTable
CREATE TABLE "WorkflowMain" (
    "wid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowMain_pkey" PRIMARY KEY ("wid")
);

-- CreateTable
CREATE TABLE "WorkflowVersion" (
    "versionid" TEXT NOT NULL,
    "wfmid" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "steps" JSONB NOT NULL,

    CONSTRAINT "WorkflowVersion_pkey" PRIMARY KEY ("versionid")
);

-- CreateTable
CREATE TABLE "JobRun" (
    "jobid" TEXT NOT NULL,
    "workflowid" TEXT NOT NULL,
    "versionid" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "starttime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endtime" TIMESTAMP(3),
    "data" JSONB NOT NULL,

    CONSTRAINT "JobRun_pkey" PRIMARY KEY ("jobid")
);

-- CreateTable
CREATE TABLE "StepRun" (
    "steprunid" TEXT NOT NULL,
    "jobid" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "output" JSONB,
    "error" TEXT,
    "starttime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endtime" TIMESTAMP(3),
    "stepid" TEXT NOT NULL,

    CONSTRAINT "StepRun_pkey" PRIMARY KEY ("steprunid")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "scheduleid" TEXT NOT NULL,
    "workflowid" TEXT NOT NULL,
    "cron" TEXT NOT NULL,
    "schedulestatus" "ScheduleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextRunAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleid")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "apikeyid" TEXT NOT NULL,
    "theapikey" TEXT NOT NULL,
    "bizid" TEXT NOT NULL,
    "apikeystaus" "ApiStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("apikeyid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bizowner_username_key" ON "Bizowner"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_theapikey_key" ON "ApiKey"("theapikey");

-- AddForeignKey
ALTER TABLE "WorkflowMain" ADD CONSTRAINT "WorkflowMain_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Bizowner"("ownerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_wfmid_fkey" FOREIGN KEY ("wfmid") REFERENCES "WorkflowMain"("wid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRun" ADD CONSTRAINT "JobRun_workflowid_fkey" FOREIGN KEY ("workflowid") REFERENCES "WorkflowMain"("wid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRun" ADD CONSTRAINT "JobRun_versionid_fkey" FOREIGN KEY ("versionid") REFERENCES "WorkflowVersion"("versionid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepRun" ADD CONSTRAINT "StepRun_jobid_fkey" FOREIGN KEY ("jobid") REFERENCES "JobRun"("jobid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_workflowid_fkey" FOREIGN KEY ("workflowid") REFERENCES "WorkflowMain"("wid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_bizid_fkey" FOREIGN KEY ("bizid") REFERENCES "Bizowner"("ownerId") ON DELETE RESTRICT ON UPDATE CASCADE;
