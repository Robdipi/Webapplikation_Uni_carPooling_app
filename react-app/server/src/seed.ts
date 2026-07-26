import bcrypt from "bcryptjs";
import { prisma } from "./app.js";

const SEED_PASSWORD = "CampusRide1";

const seedUsers = [
    {
        email: "lisa.m@htwg-konstanz.de",
        username: "lisa_m",
        firstName: "Lisa",
        lastName: "Müller",
        birthDate: "2001-03-15",
        course: "WI",
        avatarUrl: "/images/2.jpg",
    },
    {
        email: "max.w@uni-konstanz.de",
        username: "max_w",
        firstName: "Max",
        lastName: "Weber",
        birthDate: "2000-07-22",
        course: "AIN",
        avatarUrl: "/images/3.jpg",
    },
    {
        email: "sarah.f@htwg-konstanz.de",
        username: "sarah_f",
        firstName: "Sarah",
        lastName: "Fischer",
        birthDate: "2002-01-10",
        course: "MCL",
        avatarUrl: "/images/4.jpg",
    },
    {
        email: "jonas.k@uni-konstanz.de",
        username: "jonas_k",
        firstName: "Jonas",
        lastName: "Klein",
        birthDate: "2000-11-05",
        course: "AIN",
        avatarUrl: "/images/1.jpg",
    },
];

export async function seed() {
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

    for (const userData of seedUsers) {
        const existing = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (existing === null) {
            await prisma.user.create({
                data: {
                    ...userData,
                    passwordHash,
                },
            });
            console.log(`  Benutzer erstellt: ${userData.email}`);
        }
    }

    const driver = await prisma.user.findUnique({
        where: { email: "lisa.m@htwg-konstanz.de" },
    });

    if (driver !== null) {
        const existingRide = await prisma.ride.findFirst({
            where: {
                driverId: driver.id,
                departureName: "HTWG Konstanz",
                destinationName: "Universität Konstanz",
            },
        });

        if (existingRide === null) {
            await prisma.ride.create({
                data: {
                    departureName: "HTWG Konstanz",
                    destinationName: "Universität Konstanz",
                    departureLat: 47.6672,
                    departureLng: 9.1716,
                    destinationLat: 47.6897,
                    destinationLng: 9.1881,
                    distanceKm: 3.5,
                    durationMinutes: 10,
                    driverId: driver.id,
                    departureTime: "2026-07-28T08:00",
                    seatsAvailable: 3,
                    price: 3.50,
                    extra: "Nichtraucher, Kofferraum frei",
                },
            });
            console.log("  Fahrt erstellt: HTWG Konstanz → Universität Konstanz");
        }
    }
}
