-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free';
