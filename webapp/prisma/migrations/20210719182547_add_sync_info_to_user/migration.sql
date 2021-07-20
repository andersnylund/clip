-- AlterTable
ALTER TABLE "users" ADD COLUMN     "sync_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sync_id" TEXT;
