/*
  Warnings:

  - You are about to drop the `_tagtovideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_tagtovideo` DROP FOREIGN KEY `_TagToVideo_A_fkey`;

-- DropForeignKey
ALTER TABLE `_tagtovideo` DROP FOREIGN KEY `_TagToVideo_B_fkey`;

-- DropTable
DROP TABLE `_tagtovideo`;

-- DropTable
DROP TABLE `tags`;
