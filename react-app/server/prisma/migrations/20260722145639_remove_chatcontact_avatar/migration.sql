/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `ChatContact` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_ChatContact" ("id", "name") SELECT "id", "name" FROM "ChatContact";
DROP TABLE "ChatContact";
ALTER TABLE "new_ChatContact" RENAME TO "ChatContact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
