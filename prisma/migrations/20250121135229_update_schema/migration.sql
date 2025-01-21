-- AlterTable
ALTER TABLE `comment` MODIFY `content` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `video` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `description` VARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `Video_title_idx` ON `Video`(`title`);

-- CreateIndex
CREATE INDEX `Video_createdAt_idx` ON `Video`(`createdAt`);
