import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { app, prisma } from "./app";

afterAll(async () => {
    await prisma.$disconnect();
});

describe("CampusRide API", () => {
    it("returns health status", async () => {
        const response = await request(app).get("/api/health");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: "ok",
            message: "CampusRide backend is running",
        });
    });

    it("rejects /api/auth/me without token", async () => {
        const response = await request(app).get("/api/auth/me");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            error: "Kein Authorization-Header vorhanden.",
        });
    });

    it("registers a user, logs in and returns current user with token", async () => {
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

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send(registerData);

        expect(registerResponse.status).toBe(201);
        expect(registerResponse.body.token).toEqual(expect.any(String));
        expect(registerResponse.body.user.email).toBe(registerData.email);
        expect(registerResponse.body.user.username).toBe(registerData.username);
        expect(registerResponse.body.user.profile.firstName).toBe("Test");
        expect(registerResponse.body.user.password).toBeUndefined();

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                identifier: registerData.email,
                password: registerData.password,
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.token).toEqual(expect.any(String));
        expect(loginResponse.body.user.email).toBe(registerData.email);

        const token = loginResponse.body.token as string;

        const meResponse = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(meResponse.status).toBe(200);
        expect(meResponse.body.user.email).toBe(registerData.email);
        expect(meResponse.body.user.username).toBe(registerData.username);
    });

    it("rejects login with wrong password", async () => {
        const uniqueValue = Date.now();

        const registerData = {
            email: `wrong-password-${uniqueValue}@example.com`,
            username: `wrong-password-user-${uniqueValue}`,
            password: "12345",
            firstName: "Test",
            lastName: "User",
            birthDate: "2000-01-01",
            course: "AIN",
        };

        await request(app)
            .post("/api/auth/register")
            .send(registerData);

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                identifier: registerData.email,
                password: "falsch",
            });

        expect(loginResponse.status).toBe(401);
        expect(loginResponse.body).toEqual({
            error: "Benutzername/E-Mail oder Passwort ist falsch.",
        });
    });
});