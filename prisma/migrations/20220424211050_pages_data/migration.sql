-- CreateTable
CREATE TABLE "PaginationState" (
    "messageId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "stateString" TEXT NOT NULL,
    "messageData" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PaginationState_messageId_key" ON "PaginationState"("messageId");
