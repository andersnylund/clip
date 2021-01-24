/*
  Warnings:

  - You are about to drop the `node` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "node" DROP CONSTRAINT "node_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "node" DROP CONSTRAINT "node_user_id_fkey";

-- CreateTable
CREATE TABLE "clip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "index" INTEGER,
    "user_id" INTEGER NOT NULL,
    "parent_id" TEXT,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "node";

-- AddForeignKey
ALTER TABLE "clip" ADD FOREIGN KEY("user_id")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clip" ADD FOREIGN KEY("parent_id")REFERENCES "clip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
