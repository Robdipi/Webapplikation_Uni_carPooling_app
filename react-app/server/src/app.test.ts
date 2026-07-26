import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { app, prisma } from "./app.js";

const VALID_PASSWORD = "Testpass1";

afterAll(async () => {
    await prisma.chatMessage.deleteMany();
    await prisma.chatContact.deleteMany();
    await prisma.ride.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

async function registerAndLogin(): Promise<string> {
    const uniqueValue = Date.now();

    const registerData = {
        email: `test-${uniqueValue}@uni-konstanz.de`,
        username: `testuser-${uniqueValue}`,
        password: VALID_PASSWORD,
        firstName: "Test",
        lastName: "User",
        birthDate: "2000-01-01",
        course: "AIN",
    };

    const response = await request(app)
        .post("/api/auth/register")
        .send(registerData);

    return response.body.token as string;
}

function rideData(driverId: string) {
    return {
        departureName: "Konstanz HTWG",
        destinationName: "Universität Konstanz",
        departureLat: 47.6672,
        departureLng: 9.1716,
        destinationLat: 47.6897,
        destinationLng: 9.1881,
        distanceKm: 3.5,
        durationMinutes: 10,
        driverId,
        departureTime: "2026-07-25T14:00",
        seatsAvailable: 3,
        price: 5,
        extra: "Nichtraucher",
    };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

describe("Auth", () => {
    it("rejects registration with missing fields", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({ email: "a@b.de" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Es fehlen Pflichtfelder.");
    });

    it("rejects registration with empty strings", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: " ",
                username: " ",
                password: " ",
                firstName: " ",
                lastName: " ",
                birthDate: " ",
                course: " ",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Bitte fülle alle Pflichtfelder aus.");
    });


    it("rejects duplicate email", async () => {
        const uniqueValue = Date.now();
        const data = {
            email: `dup-${uniqueValue}@uni-konstanz.de`,
            username: `dup-user-${uniqueValue}`,
            password: VALID_PASSWORD,
            firstName: "Dup",
            lastName: "Test",
            birthDate: "2000-01-01",
            course: "AIN",
        };

        await request(app).post("/api/auth/register").send(data);

        const response = await request(app)
            .post("/api/auth/register")
            .send({ ...data, username: `other-${uniqueValue}` });

        expect(response.status).toBe(409);
        expect(response.body.error).toBe("E-Mail oder Benutzername ist bereits registriert.");
    });

    it("returns avatarUrl in user profile", async () => {
        const uniqueValue = Date.now();

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: `avatar-${uniqueValue}@uni-konstanz.de`,
                username: `avatar-user-${uniqueValue}`,
                password: VALID_PASSWORD,
                firstName: "Avatar",
                lastName: "Test",
                birthDate: "2000-01-01",
                course: "AIN",
            });

        expect(response.status).toBe(201);
        expect(response.body.user.profile).toHaveProperty("avatarUrl");
    });
});

// ── Rides ─────────────────────────────────────────────────────────────────────

describe("Rides", () => {
    it("creates a ride, shows it on GET, then deletes it", async () => {
        const token = await registerAndLogin();
        const me = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        const userId = me.body.user.id as string;

        // Create
        const createRes = await request(app)
            .post("/api/rides")
            .set("Authorization", `Bearer ${token}`)
            .send(rideData(userId));

        expect(createRes.status).toBe(201);
        expect(createRes.body.ride.id).toEqual(expect.any(String));
        expect(createRes.body.ride.departureName).toBe("Konstanz HTWG");
        expect(createRes.body.ride.destinationName).toBe("Universität Konstanz");
        expect(createRes.body.ride.driverId).toBe(userId);
        expect(createRes.body.ride.driverName).toBe("Test User");

        const rideId = createRes.body.ride.id as string;

        // GET /api/rides shows it
        const listRes = await request(app).get("/api/rides");
        expect(listRes.status).toBe(200);

        const rides = listRes.body.rides as Array<{ id: string }>;
        expect(rides.some((r) => r.id === rideId)).toBe(true);

        // DB also has it
        const dbRide = await prisma.ride.findUnique({ where: { id: rideId } });
        expect(dbRide).not.toBeNull();
        expect(dbRide!.departureName).toBe("Konstanz HTWG");

        // Delete
        const deleteRes = await request(app)
            .delete(`/api/rides/${rideId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.success).toBe(true);

        // Gone from DB
        const dbRideAfter = await prisma.ride.findUnique({ where: { id: rideId } });
        expect(dbRideAfter).toBeNull();

        // Gone from GET
        const listAfter = await request(app).get("/api/rides");
        const ridesAfter = listAfter.body.rides as Array<{ id: string }>;
        expect(ridesAfter.some((r) => r.id === rideId)).toBe(false);
    });

    it("rejects ride creation without auth token", async () => {
        const response = await request(app)
            .post("/api/rides")
            .send(rideData("some-user-id"));

        expect(response.status).toBe(401);
    });

    it("rejects ride creation with missing fields", async () => {
        const token = await registerAndLogin();

        const response = await request(app)
            .post("/api/rides")
            .set("Authorization", `Bearer ${token}`)
            .send({ departureName: "nur das" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Es fehlen Pflichtfelder.");
    });

    it("updates a ride's seats and price", async () => {
        const token = await registerAndLogin();
        const me = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        const userId = me.body.user.id as string;

        const createRes = await request(app)
            .post("/api/rides")
            .set("Authorization", `Bearer ${token}`)
            .send(rideData(userId));

        const rideId = createRes.body.ride.id as string;

        const updateRes = await request(app)
            .put(`/api/rides/${rideId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ seatsAvailable: 1, price: 8 });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.ride.seatsAvailable).toBe(1);
        expect(updateRes.body.ride.price).toBe(8);
        expect(updateRes.body.ride.departureName).toBe("Konstanz HTWG");

        // Cleanup
        await request(app)
            .delete(`/api/rides/${rideId}`)
            .set("Authorization", `Bearer ${token}`);
    });

    it("rejects ride creation with invalid driverId", async () => {
        const token = await registerAndLogin();

        const response = await request(app)
            .post("/api/rides")
            .set("Authorization", `Bearer ${token}`)
            .send(rideData("non-existent-user-id"));

        expect(response.status).toBe(500);
    });

    it("rejects updating another user's ride", async () => {
        const token1 = await registerAndLogin();
        const me1 = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token1}`);

        const userId1 = me1.body.user.id as string;

        const createRes = await request(app)
            .post("/api/rides")
            .set("Authorization", `Bearer ${token1}`)
            .send(rideData(userId1));

        const rideId = createRes.body.ride.id as string;

        const token2 = await registerAndLogin();

        const updateRes = await request(app)
            .put(`/api/rides/${rideId}`)
            .set("Authorization", `Bearer ${token2}`)
            .send({ seatsAvailable: 1 });

        expect(updateRes.status).toBe(403);

        // Cleanup
        await request(app)
            .delete(`/api/rides/${rideId}`)
            .set("Authorization", `Bearer ${token1}`);
    });
});

// ── Chat ──────────────────────────────────────────────────────────────────────

describe("Chat", () => {
    it("creates a contact, sends a message, verifies it in DB, then clears chat", async () => {
        const token = await registerAndLogin();
        const otherToken = await registerAndLogin();
        const otherMe = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${otherToken}`);

        const otherUserId = otherMe.body.user.id as string;

        // Create contact
        const contactRes = await request(app)
            .post("/api/chat/contacts")
            .set("Authorization", `Bearer ${token}`)
            .send({ userId: otherUserId });

        expect(contactRes.status).toBe(201);
        expect(contactRes.body.contact.userId).toBe(otherUserId);
        expect(contactRes.body.contact.user.firstName).toBe("Test");

        const contactId = contactRes.body.contact.id as string;

        const me = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);
        const userId = me.body.user.id as string;

        // Send message
        const msgRes = await request(app)
            .post("/api/chat/messages")
            .set("Authorization", `Bearer ${token}`)
            .send({
                contactId,
                senderId: userId,
                type: "text",
                content: "Hallo, wie geht's?",
                sentAt: "14:30",
            });

        expect(msgRes.status).toBe(201);
        expect(msgRes.body.message.content).toBe("Hallo, wie geht's?");
        expect(msgRes.body.message.senderId).toBe(userId);

        // Verify in DB
        const dbMsg = await prisma.chatMessage.findUnique({
            where: { id: msgRes.body.message.id },
        });
        expect(dbMsg).not.toBeNull();
        expect(dbMsg!.content).toBe("Hallo, wie geht's?");
        expect(dbMsg!.contactId).toBe(contactId);

        // Send another message
        await request(app)
            .post("/api/chat/messages")
            .set("Authorization", `Bearer ${token}`)
            .send({
                contactId,
                senderId: userId,
                type: "text",
                content: "Mir gut, danke!",
                sentAt: "14:31",
            });

        // GET contacts includes messages
        const contactsRes = await request(app)
            .get("/api/chat/contacts")
            .set("Authorization", `Bearer ${token}`);
        expect(contactsRes.status).toBe(200);

        const contact = contactsRes.body.contacts.find(
            (c: { id: string }) => c.id === contactId,
        );
        expect(contact).toBeDefined();
        expect(contact.messages).toHaveLength(2);

        // Clear chat
        const clearRes = await request(app)
            .delete(`/api/chat/messages/${contactId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(clearRes.status).toBe(200);
        expect(clearRes.body.success).toBe(true);

        // Messages gone from DB
        const msgsAfter = await prisma.chatMessage.findMany({
            where: { contactId },
        });
        expect(msgsAfter).toHaveLength(0);

        // Cleanup: delete the test contact
        await request(app)
            .delete(`/api/chat/contacts/${contactId}`)
            .set("Authorization", `Bearer ${token}`);
    });

    it("rejects message creation with missing fields", async () => {
        const token = await registerAndLogin();
        const response = await request(app)
            .post("/api/chat/messages")
            .set("Authorization", `Bearer ${token}`)
            .send({ contactId: "x", senderId: "y" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Alle Nachrichtenfelder werden benötigt.");
    });

    it("rejects contact creation with missing fields", async () => {
        const token = await registerAndLogin();
        const response = await request(app)
            .post("/api/chat/contacts")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("userId wird benötigt.");
    });

    it("deletes a contact and its messages", async () => {
        const token = await registerAndLogin();
        const otherToken = await registerAndLogin();
        const otherMe = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${otherToken}`);

        const otherUserId = otherMe.body.user.id as string;

        const contactRes = await request(app)
            .post("/api/chat/contacts")
            .set("Authorization", `Bearer ${token}`)
            .send({ userId: otherUserId });

        expect(contactRes.status).toBe(201);
        const contactId = contactRes.body.contact.id as string;

        const me = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);
        const userId = me.body.user.id as string;

        // Send a message to the contact
        await request(app)
            .post("/api/chat/messages")
            .set("Authorization", `Bearer ${token}`)
            .send({
                contactId,
                senderId: userId,
                type: "text",
                content: "Testnachricht",
                sentAt: "12:00",
            });

        // Delete the contact
        const deleteRes = await request(app)
            .delete(`/api/chat/contacts/${contactId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.success).toBe(true);

        // Contact gone from DB
        const contactAfter = await prisma.chatContact.findUnique({
            where: { id: contactId },
        });
        expect(contactAfter).toBeNull();

        // Messages also gone
        const msgsAfter = await prisma.chatMessage.findMany({
            where: { contactId },
        });
        expect(msgsAfter).toHaveLength(0);
    });

    it("rejects chat endpoints without auth token", async () => {
        const contactsRes = await request(app).get("/api/chat/contacts");
        expect(contactsRes.status).toBe(401);

        const msgRes = await request(app)
            .post("/api/chat/messages")
            .send({ contactId: "x", senderId: "y", type: "text", content: "hi", sentAt: "now" });
        expect(msgRes.status).toBe(401);
    });
});

// ── Avatar-Click creates Chat Contact ───────────────────────────────────────

describe("Avatar click creates chat contact", () => {
    it("creates a chat contact when a passenger clicks the driver avatar on a ride listing", async () => {
        // 1. Register a driver
        const driverToken = await registerAndLogin();
        const driverMe = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${driverToken}`);
        const driverId = driverMe.body.user.id as string;
        const driverFirstName = driverMe.body.user.profile.firstName as string;
        const driverLastName = driverMe.body.user.profile.lastName as string;

        // 2. Register a passenger
        const passengerToken = await registerAndLogin();

        // 3. Driver creates a ride
        const createRes = await request(app)
            .post("/api/rides")
            .set("Authorization", `Bearer ${driverToken}`)
            .send(rideData(driverId));

        expect(createRes.status).toBe(201);
        const rideId = createRes.body.ride.id as string;

        // 4. Passenger sees the ride listing (GET /api/rides)
        const listRes = await request(app).get("/api/rides");
        expect(listRes.status).toBe(200);

        const listedRide = listRes.body.rides.find(
            (r: { id: string }) => r.id === rideId,
        );
        expect(listedRide).toBeDefined();
        expect(listedRide.driverName).toBe(`${driverFirstName} ${driverLastName}`);

        // 5. Passenger clicks the driver avatar → creates a chat contact
        const contactRes = await request(app)
            .post("/api/chat/contacts")
            .set("Authorization", `Bearer ${passengerToken}`)
            .send({ userId: driverId });

        expect(contactRes.status).toBe(201);
        expect(contactRes.body.contact.userId).toBe(driverId);
        expect(contactRes.body.contact.user.firstName).toBe(driverFirstName);
        expect(contactRes.body.contact.user.lastName).toBe(driverLastName);

        const contactId = contactRes.body.contact.id as string;

        // 6. Chat page would show the new contact
        const contactsRes = await request(app)
            .get("/api/chat/contacts")
            .set("Authorization", `Bearer ${passengerToken}`);

        expect(contactsRes.status).toBe(200);
        const found = contactsRes.body.contacts.find(
            (c: { id: string }) => c.id === contactId,
        );
        expect(found).toBeDefined();
        expect(found.user.firstName).toBe(driverFirstName);

        // 7. Clicking the same avatar again creates another contact
        const duplicateRes = await request(app)
            .post("/api/chat/contacts")
            .set("Authorization", `Bearer ${passengerToken}`)
            .send({ userId: driverId });

        expect(duplicateRes.status).toBe(201);
        const contactsAfter = await request(app)
            .get("/api/chat/contacts")
            .set("Authorization", `Bearer ${passengerToken}`);

        expect(contactsAfter.status).toBe(200);
        const passengerContacts = contactsAfter.body.contacts.filter(
            (c: { userId: string }) => c.userId === driverId,
        );
        expect(passengerContacts.length).toBeGreaterThanOrEqual(1);

        // Cleanup
        await request(app)
            .delete(`/api/chat/contacts/${contactId}`)
            .set("Authorization", `Bearer ${passengerToken}`);

        await request(app)
            .delete(`/api/rides/${rideId}`)
            .set("Authorization", `Bearer ${driverToken}`);
    });
});

// ── DB Status ─────────────────────────────────────────────────────────────────

describe("Database", () => {
    it("reports connected status with user count", async () => {
        const response = await request(app).get("/api/db-status");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("ok");
        expect(response.body.database).toBe("connected");
        expect(typeof response.body.users).toBe("number");
    });
});
