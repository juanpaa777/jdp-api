/*
  Warnings:

  - You are about to alter the column `name` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(150)`.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `name` VARCHAR(150) NOT NULL,
    MODIFY `description` VARCHAR(200) NOT NULL,
    ALTER COLUMN `priority` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `lastName`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `lastname` VARCHAR(300) NOT NULL;

-- DropTable
DROP TABLE `post`;
