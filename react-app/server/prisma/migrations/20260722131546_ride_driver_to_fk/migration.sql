/*
  Warnings:

  - You are about to drop the column `driver` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `driverId` to the `Ride` table without a default value. This is not possible if the table is not empty.

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
    "driverId" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "seatsAvailable" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "extra" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ride" ("createdAt", "departureLat", "departureLng", "departureName", "departureTime", "destinationLat", "destinationLng", "destinationName", "distanceKm", "durationMinutes", "extra", "id", "price", "seatsAvailable", "updatedAt") SELECT "createdAt", "departureLat", "departureLng", "departureName", "departureTime", "destinationLat", "destinationLng", "destinationName", "distanceKm", "durationMinutes", "extra", "id", "price", "seatsAvailable", "updatedAt" FROM "Ride";
DROP TABLE "Ride";
ALTER TABLE "new_Ride" RENAME TO "Ride";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
