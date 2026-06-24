import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const jwtSecret = process.env.JWT_SECRET ?? "campusride-dev-secret";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma = new PrismaClient({ adapter });

export const app = express();

app.use(cors());
app.use(express.json());

interface AuthTokenPayload {
    userId: string;
    email: string;
}

interface AuthenticatedRequest extends Request {
    user?: AuthTokenPayload;
}

interface RegisterRequestBody {
    email?: string;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    course?: string;
}

interface LoginRequestBody {
    identifier?: string;
    password?: string;
}

function createToken(user: User): string {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        jwtSecret,
        {
            expiresIn: "2h",
        },
    );
}

function publicUser(user: User) {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            course: user.course,
        },
    };
}

function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;

    if (authHeader === undefined) {
        res.status(401).json({
            error: "Kein Authorization-Header vorhanden.",
        });
        return;
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || token === undefined) {
        res.status(401).json({
            error: "Ungültiges Token-Format.",
        });
        return;
    }

    try {
        const payload = jwt.verify(token, jwtSecret) as AuthTokenPayload;
        req.user = payload;
        next();
    } catch {
        res.status(401).json({
            error: "Token ist ungültig oder abgelaufen.",
        });
    }
}

app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        status: "ok",
        message: "CampusRide backend is running",
    });
});

app.get("/api/db-status", async (_req: Request, res: Response) => {
    try {
        const userCount = await prisma.user.count();

        res.json({
            status: "ok",
            database: "connected",
            users: userCount,
        });
    } catch (error) {
        console.error("Database check failed:", error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed",
        });
    }
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
    const {
        email,
        username,
        password,
        firstName,
        lastName,
        birthDate,
        course,
    } = req.body as RegisterRequestBody;

    if (
        email === undefined ||
        username === undefined ||
        password === undefined ||
        firstName === undefined ||
        lastName === undefined ||
        birthDate === undefined ||
        course === undefined
    ) {
        res.status(400).json({
            error: "Es fehlen Pflichtfelder.",
        });
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (
        normalizedEmail === "" ||
        normalizedUsername === "" ||
        password.trim() === "" ||
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        birthDate.trim() === "" ||
        course.trim() === ""
    ) {
        res.status(400).json({
            error: "Bitte fülle alle Pflichtfelder aus.",
        });
        return;
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: normalizedEmail },
                    { username: normalizedUsername },
                ],
            },
        });

        if (existingUser !== null) {
            res.status(409).json({
                error: "E-Mail oder Benutzername ist bereits registriert.",
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                username: normalizedUsername,
                passwordHash,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                birthDate: birthDate.trim(),
                course: course.trim(),
            },
        });

        const token = createToken(newUser);

        res.status(201).json({
            token,
            user: publicUser(newUser),
        });
    } catch (error) {
        console.error("Register failed:", error);

        res.status(500).json({
            error: "Registrierung fehlgeschlagen.",
        });
    }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { identifier, password } = req.body as LoginRequestBody;

    if (identifier === undefined || password === undefined) {
        res.status(400).json({
            error: "Benutzername/E-Mail und Passwort werden benötigt.",
        });
        return;
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    if (normalizedIdentifier === "" || password.trim() === "") {
        res.status(400).json({
            error: "Benutzername/E-Mail und Passwort werden benötigt.",
        });
        return;
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: normalizedIdentifier },
                    { username: normalizedIdentifier },
                ],
            },
        });

        if (user === null) {
            res.status(401).json({
                error: "Benutzername/E-Mail oder Passwort ist falsch.",
            });
            return;
        }

        const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordIsValid) {
            res.status(401).json({
                error: "Benutzername/E-Mail oder Passwort ist falsch.",
            });
            return;
        }

        const token = createToken(user);

        res.json({
            token,
            user: publicUser(user),
        });
    } catch (error) {
        console.error("Login failed:", error);

        res.status(500).json({
            error: "Login fehlgeschlagen.",
        });
    }
});

app.get(
    "/api/auth/me",
    authenticateToken,
    async (req: AuthenticatedRequest, res: Response) => {
        if (req.user === undefined) {
            res.status(401).json({
                error: "Nicht angemeldet.",
            });
            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            if (user === null) {
                res.status(404).json({
                    error: "User wurde nicht gefunden.",
                });
                return;
            }

            res.json({
                user: publicUser(user),
            });
        } catch (error) {
            console.error("Get current user failed:", error);

            res.status(500).json({
                error: "User konnte nicht geladen werden.",
            });
        }
    },
);