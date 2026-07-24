/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Ride` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ride" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departureName" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "departureLat" REAL NOT NULL,
    "departureLng" REAL NOT NULL,
    "destinationLat" REAL NOT NULL,
    "destinationLng" REAL NOT NULL,
    "distanceKm" REAL NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "driver" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "seatsAvailable" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "extra" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Ride" ("createdAt", "departureLat", "departureLng", "departureName", "departureTime", "destinationLat", "destinationLng", "destinationName", "distanceKm", "driver", "durationMinutes", "extra", "id", "price", "seatsAvailable", "updatedAt") SELECT "createdAt", "departureLat", "departureLng", "departureName", "departureTime", "destinationLat", "destinationLng", "destinationName", "distanceKm", "driver", "durationMinutes", "extra", "id", "price", "seatsAvailable", "updatedAt" FROM "Ride";
DROP TABLE "Ride";
ALTER TABLE "new_Ride" RENAME TO "Ride";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("birthDate", "course", "createdAt", "email", "firstName", "id", "lastName", "passwordHash", "updatedAt", "username") SELECT "birthDate", "course", "createdAt", "email", "firstName", "id", "lastName", "passwordHash", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
