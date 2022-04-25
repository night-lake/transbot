/*
  Warnings:

  - You are about to drop the column `authorid` on the `TransitionGoal` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `TransitionGoal` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransitionGoal" (
    "goalId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TransitionGoal" ("createdAt", "goalId", "imageURL", "title", "authorId") SELECT "createdAt", "goalId", "imageURL", "title", "authorid" FROM "TransitionGoal";
DROP TABLE "TransitionGoal";
ALTER TABLE "new_TransitionGoal" RENAME TO "TransitionGoal";
CREATE UNIQUE INDEX "TransitionGoal_goalId_key" ON "TransitionGoal"("goalId");
CREATE INDEX "TransitionGoal_goalId_authorId_title_idx" ON "TransitionGoal"("goalId" ASC, "authorId" ASC, "title" ASC);
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "PaginationState_messageId_idx" ON "PaginationState"("messageId");
