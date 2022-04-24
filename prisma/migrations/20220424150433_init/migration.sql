-- CreateTable
CREATE TABLE "TransitionGoal" (
    "goalId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "TransitionGoal_goalId_key" ON "TransitionGoal"("goalId");

-- CreateIndex
CREATE INDEX "TransitionGoal_authorid_idx" ON "TransitionGoal"("authorid" ASC);
