-- CreateTable
CREATE TABLE "AttachmentURLStore" (
    "attachmentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attachmentURL" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AttachmentURLStore_attachmentId_key" ON "AttachmentURLStore"("attachmentId");
