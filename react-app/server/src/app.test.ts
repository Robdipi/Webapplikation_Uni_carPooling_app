import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { app, prisma } from "./app";

afterAll(async () => {
    await prisma.$disconnect();
});

async function registerAndLogin(): Promise<string> {
    const uniqueValue = Date.now();

    const registerData = {
        email: `test-${uniqueValue}@example.com`,
        username: `testuser-${uniqueValue}`,
        password: "12345",
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
            email: `dup-${uniqueValue}@example.com`,
            username: `dup-user-${uniqueValue}`,
            password: "12345",
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
                email: `avatar-${uniqueValue}@example.com`,
                username: `avatar-user-${uniqueValue}`,
                password: "12345",
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
});

// ── Chat ──────────────────────────────────────────────────────────────────────

describe("Chat", () => {
    it("creates a contact, sends a message, verifies it in DB, then clears chat", async () => {
        // Register a user for the contact
        const uniqueValue = Date.now();
        const registerRes = await request(app)
            .post("/api/auth/register")
            .send({
                email: `chat-test-${uniqueValue}@example.com`,
                username: `chat-test-user-${uniqueValue}`,
                password: "12345",
                firstName: "Chat",
                lastName: "Test",
                birthDate: "2000-01-01",
                course: "AIN",
            });

        const userId = registerRes.body.user.id as string;

        // Create contact
        const contactRes = await request(app)
            .post("/api/chat/contacts")
            .send({ name: "Test Kontakt", userId });

        expect(contactRes.status).toBe(201);
        expect(contactRes.body.contact.name).toBe("Test Kontakt");
        expect(contactRes.body.contact.userId).toBe(userId);
        expect(contactRes.body.contact.user.firstName).toBe("Chat");

        const contactId = contactRes.body.contact.id as string;

        // Send message
        const msgRes = await request(app)
            .post("/api/chat/messages")
            .send({
                contactId,
                sender: "me",
                type: "text",
                content: "Hallo, wie geht's?",
                sentAt: "14:30",
            });

        expect(msgRes.status).toBe(201);
        expect(msgRes.body.message.content).toBe("Hallo, wie geht's?");
        expect(msgRes.body.message.sender).toBe("me");

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
            .send({
                contactId,
                sender: "contact",
                type: "text",
                content: "Mir gut, danke!",
                sentAt: "14:31",
            });

        // GET contacts includes messages
        const contactsRes = await request(app).get("/api/chat/contacts");
        expect(contactsRes.status).toBe(200);

        const contact = contactsRes.body.contacts.find(
            (c: { id: string }) => c.id === contactId,
        );
        expect(contact).toBeDefined();
        expect(contact.messages).toHaveLength(2);

        // Clear chat
        const clearRes = await request(app)
            .delete(`/api/chat/messages/${contactId}`);

        expect(clearRes.status).toBe(200);
        expect(clearRes.body.success).toBe(true);

        // Messages gone from DB
        const msgsAfter = await prisma.chatMessage.findMany({
            where: { contactId },
        });
        expect(msgsAfter).toHaveLength(0);

        // Cleanup: delete the test contact
        await prisma.chatContact.delete({ where: { id: contactId } });
    });

    it("rejects message creation with missing fields", async () => {
        const response = await request(app)
            .post("/api/chat/messages")
            .send({ contactId: "x", sender: "me" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Alle Nachrichtenfelder werden benötigt.");
    });

    it("rejects contact creation with missing fields", async () => {
        const response = await request(app)
            .post("/api/chat/contacts")
            .send({ name: "Nur Name" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Name und userId werden benötigt.");
    });

    it("deletes a contact and its messages", async () => {
        const uniqueValue = Date.now();
        const registerRes = await request(app)
            .post("/api/auth/register")
            .send({
                email: `del-test-${uniqueValue}@example.com`,
                username: `del-test-user-${uniqueValue}`,
                password: "12345",
                firstName: "Del",
                lastName: "Test",
                birthDate: "2000-01-01",
                course: "AIN",
            });

        const userId = registerRes.body.user.id as string;

        const contactRes = await request(app)
            .post("/api/chat/contacts")
            .send({ name: "Del Kontakt", userId });

        expect(contactRes.status).toBe(201);
        const contactId = contactRes.body.contact.id as string;

        // Send a message to the contact
        await request(app)
            .post("/api/chat/messages")
            .send({
                contactId,
                sender: "me",
                type: "text",
                content: "Testnachricht",
                sentAt: "12:00",
            });

        // Delete the contact
        const deleteRes = await request(app)
            .delete(`/api/chat/contacts/${contactId}`);

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
