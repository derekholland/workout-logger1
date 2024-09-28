/*
  Warnings:

  - You are about to alter the column `weight` on the `set` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `title` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `set` MODIFY `weight` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `workout` ADD COLUMN `title` VARCHAR(191) NOT NULL;
