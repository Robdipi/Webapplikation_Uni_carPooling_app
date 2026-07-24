/*
  Warnings:

  - You are about to drop the column `name` on the `ChatContact` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ChatContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatContact" ("id", "userId") SELECT "id", "userId" FROM "ChatContact";
DROP TABLE "ChatContact";
ALTER TABLE "new_ChatContact" RENAME TO "ChatContact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
