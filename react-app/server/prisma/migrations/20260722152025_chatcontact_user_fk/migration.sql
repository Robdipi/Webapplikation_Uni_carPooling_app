/*
  Warnings:

  - Added the required column `userId` to the `ChatContact` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ChatContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatContact" ("id", "name") SELECT "id", "name" FROM "ChatContact";
DROP TABLE "ChatContact";
ALTER TABLE "new_ChatContact" RENAME TO "ChatContact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
