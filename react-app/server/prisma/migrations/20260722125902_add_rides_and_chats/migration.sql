-- CreateTable
CREATE TABLE "Ride" (
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
    "avatarUrl" TEXT NOT NULL,
    "departureTime" TEXT NOT NULL,
    "seatsAvailable" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "extra" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChatContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TEXT NOT NULL,
    CONSTRAINT "ChatMessage_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "ChatContact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
