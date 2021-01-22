/*
  Warnings:

  - You are about to drop the `clips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `folders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clips" DROP CONSTRAINT "clips_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_user_id_fkey";

-- CreateTable
CREATE TABLE "node" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "index" INTEGER,
    "user_id" INTEGER NOT NULL,
    "parent_id" TEXT,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "clips";

-- DropTable
DROP TABLE "folders";

-- AddForeignKey
ALTER TABLE "node" ADD FOREIGN KEY("user_id")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node" ADD FOREIGN KEY("parent_id")REFERENCES "node"("id") ON DELETE SET NULL ON UPDATE CASCADE;
