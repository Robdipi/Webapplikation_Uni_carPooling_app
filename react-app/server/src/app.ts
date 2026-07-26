import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Verifier } from "academic-email-verifier";

const jwtSecret: string = process.env.JWT_SECRET ?? "";
if (jwtSecret === "") {
    throw new Error("JWT_SECRET environment variable is required");
}

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma = new PrismaClient({ adapter });

export const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
}));
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
    avatarUrl?: string;
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
            city: user.city,
            pricePerKm: user.pricePerKm,
            avatarUrl: user.avatarUrl,
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
        avatarUrl,
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

        const isAcademic = await Verifier.isAcademic(normalizedEmail);
        if (!isAcademic) {
            res.status(400).json({
                error: "Nur Universitäts-E-Mails sind erlaubt.",
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const defaultAvatars = [
            "/images/1.jpg",
            "/images/2.jpg",
            "/images/3.jpg",
            "/images/4.jpg",
        ];

        const resolvedAvatarUrl =
            avatarUrl !== undefined && avatarUrl.trim() !== ""
                ? avatarUrl.trim()
                : defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                username: normalizedUsername,
                passwordHash,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                birthDate: birthDate.trim(),
                course: course.trim(),
                avatarUrl: resolvedAvatarUrl,
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

interface UpdateProfileRequestBody {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    course?: string;
    city?: string;
    pricePerKm?: number;
    avatarUrl?: string;
}

app.put(
    "/api/auth/me",
    authenticateToken,
    async (req: AuthenticatedRequest, res: Response) => {
        if (req.user === undefined) {
            res.status(401).json({ error: "Nicht angemeldet." });
            return;
        }

        const body = req.body as UpdateProfileRequestBody;

        const data: Record<string, string | number> = {};
        if (body.firstName !== undefined) data.firstName = body.firstName;
        if (body.lastName !== undefined) data.lastName = body.lastName;
        if (body.birthDate !== undefined) data.birthDate = body.birthDate;
        if (body.course !== undefined) data.course = body.course;
        if (body.city !== undefined) data.city = body.city;
        if (body.pricePerKm !== undefined) data.pricePerKm = body.pricePerKm;
        if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl;

        try {
            await prisma.user.update({
                where: { id: req.user.userId },
                data,
            });

            const user = await prisma.user.findUnique({
                where: { id: req.user.userId },
            });

            res.json({ user: publicUser(user!) });
        } catch (error) {
            console.error("Update profile failed:", error);
            res.status(500).json({ error: "Profil konnte nicht aktualisiert werden." });
        }
    },
);

// ── Rides ────────────────────────────────────────────────────────────────────

interface CreateRideRequestBody {
    departureName?: string;
    destinationName?: string;
    departureLat?: number;
    departureLng?: number;
    destinationLat?: number;
    destinationLng?: number;
    distanceKm?: number;
    durationMinutes?: number;
    driverId?: string;
    departureTime?: string;
    seatsAvailable?: number;
    price?: number;
    extra?: string;
}

type RideWithDriver = {
    id: string;
    departureName: string;
    destinationName: string;
    departureLat: number;
    departureLng: number;
    destinationLat: number;
    destinationLng: number;
    distanceKm: number;
    durationMinutes: number;
    driverId: string;
    departureTime: string;
    seatsAvailable: number;
    price: number;
    extra: string;
    driver: { firstName: string; lastName: string; avatarUrl: string };
};

function publicRide(ride: RideWithDriver) {
    return {
        id: ride.id,
        departureName: ride.departureName,
        destinationName: ride.destinationName,
        departureCoords: { lat: ride.departureLat, lng: ride.departureLng },
        destinationCoords: { lat: ride.destinationLat, lng: ride.destinationLng },
        distanceKm: ride.distanceKm,
        durationMinutes: ride.durationMinutes,
        driverId: ride.driverId,
        driverName: `${ride.driver.firstName} ${ride.driver.lastName}`,
        driverAvatarUrl: ride.driver.avatarUrl,
        departureTime: ride.departureTime,
        seatsAvailable: ride.seatsAvailable,
        price: ride.price,
        extra: ride.extra,
    };
}

app.get("/api/rides", async (_req: Request, res: Response) => {
    try {
        const rides = await prisma.ride.findMany({
            orderBy: { createdAt: "desc" },
            include: { driver: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        });

        res.json({ rides: rides.map(publicRide) });
    } catch (error) {
        console.error("Get rides failed:", error);
        res.status(500).json({ error: "Fahrten konnten nicht geladen werden." });
    }
});

app.post("/api/rides", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as CreateRideRequestBody;

    if (
        body.departureName === undefined ||
        body.destinationName === undefined ||
        body.departureLat === undefined ||
        body.departureLng === undefined ||
        body.destinationLat === undefined ||
        body.destinationLng === undefined ||
        body.distanceKm === undefined ||
        body.durationMinutes === undefined ||
        body.driverId === undefined ||
        body.departureTime === undefined ||
        body.seatsAvailable === undefined ||
        body.price === undefined ||
        body.extra === undefined
    ) {
        res.status(400).json({ error: "Es fehlen Pflichtfelder." });
        return;
    }

    try {
        const created = await prisma.ride.create({
            data: {
                departureName: body.departureName,
                destinationName: body.destinationName,
                departureLat: body.departureLat,
                departureLng: body.departureLng,
                destinationLat: body.destinationLat,
                destinationLng: body.destinationLng,
                distanceKm: body.distanceKm,
                durationMinutes: body.durationMinutes,
                driverId: body.driverId,
                departureTime: body.departureTime,
                seatsAvailable: body.seatsAvailable,
                price: body.price,
                extra: body.extra,
            },
        });

        const ride = await prisma.ride.findUnique({
            where: { id: created.id },
            include: { driver: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        });

        res.status(201).json({ ride: publicRide(ride!) });
    } catch (error) {
        console.error("Create ride failed:", error);
        res.status(500).json({ error: "Fahrt konnte nicht erstellt werden." });
    }
});

app.put(
    "/api/rides/:id",
    authenticateToken,
    async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const body = req.body as Partial<CreateRideRequestBody>;

        const existingRide = await prisma.ride.findUnique({ where: { id } });
        if (existingRide === null) {
            res.status(404).json({ error: "Fahrt wurde nicht gefunden." });
            return;
        }
        if (existingRide.driverId !== req.user?.userId) {
            res.status(403).json({ error: "Keine Berechtigung, diese Fahrt zu bearbeiten." });
            return;
        }

        const data: Record<string, string | number> = {};
        if (body.departureName !== undefined) data.departureName = body.departureName;
        if (body.destinationName !== undefined) data.destinationName = body.destinationName;
        if (body.departureLat !== undefined) data.departureLat = body.departureLat;
        if (body.departureLng !== undefined) data.departureLng = body.departureLng;
        if (body.destinationLat !== undefined) data.destinationLat = body.destinationLat;
        if (body.destinationLng !== undefined) data.destinationLng = body.destinationLng;
        if (body.distanceKm !== undefined) data.distanceKm = body.distanceKm;
        if (body.durationMinutes !== undefined) data.durationMinutes = body.durationMinutes;
        if (body.departureTime !== undefined) data.departureTime = body.departureTime;
        if (body.seatsAvailable !== undefined) data.seatsAvailable = body.seatsAvailable;
        if (body.price !== undefined) data.price = body.price;
        if (body.extra !== undefined) data.extra = body.extra;

        try {
            await prisma.ride.update({
                where: { id },
                data,
            });

            const ride = await prisma.ride.findUnique({
                where: { id },
                include: { driver: { select: { firstName: true, lastName: true, avatarUrl: true } } },
            });

            res.json({ ride: publicRide(ride!) });
        } catch (error) {
            console.error("Update ride failed:", error);
            res.status(500).json({ error: "Fahrt konnte nicht aktualisiert werden." });
        }
    },
);

app.delete(
    "/api/rides/:id",
    authenticateToken,
    async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;

        const existingRide = await prisma.ride.findUnique({ where: { id } });
        if (existingRide === null) {
            res.status(404).json({ error: "Fahrt wurde nicht gefunden." });
            return;
        }
        if (existingRide.driverId !== req.user?.userId) {
            res.status(403).json({ error: "Keine Berechtigung, diese Fahrt zu löschen." });
            return;
        }

        try {
            await prisma.ride.delete({ where: { id } });
            res.json({ success: true });
        } catch (error) {
            console.error("Delete ride failed:", error);
            res.status(500).json({ error: "Fahrt konnte nicht gelöscht werden." });
        }
    },
);

// ── Chat ─────────────────────────────────────────────────────────────────────

app.get("/api/chat/contacts", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const contacts = await prisma.chatContact.findMany({
            include: {
                messages: {
                    include: {
                        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                    },
                },
                user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            },
        });
        res.json({ contacts });
    } catch (error) {
        console.error("Get chat contacts failed:", error);
        res.status(500).json({ error: "Kontakte konnten nicht geladen werden." });
    }
});

app.post("/api/chat/contacts", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.body as { userId?: string };

    if (userId === undefined) {
        res.status(400).json({ error: "userId wird benötigt." });
        return;
    }

    try {
        const contact = await prisma.chatContact.create({
            data: { userId },
            include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        });
        res.status(201).json({ contact });
    } catch (error) {
        console.error("Create chat contact failed:", error);
        res.status(500).json({ error: "Kontakt konnte nicht erstellt werden." });
    }
});

app.post("/api/chat/messages", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { contactId, senderId, type, content, sentAt } = req.body as {
        contactId?: string;
        senderId?: string;
        type?: string;
        content?: string;
        sentAt?: string;
    };

    if (
        contactId === undefined ||
        senderId === undefined ||
        type === undefined ||
        content === undefined ||
        sentAt === undefined
    ) {
        res.status(400).json({ error: "Alle Nachrichtenfelder werden benötigt." });
        return;
    }

    try {
        const message = await prisma.chatMessage.create({
            data: { contactId, senderId, type, content, sentAt },
        });
        res.status(201).json({ message });
    } catch (error) {
        console.error("Create chat message failed:", error);
        res.status(500).json({ error: "Nachricht konnte nicht erstellt werden." });
    }
});

app.delete("/api/chat/messages/:contactId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { contactId } = req.params;

    try {
        await prisma.chatMessage.deleteMany({ where: { contactId } });
        res.json({ success: true });
    } catch (error) {
        console.error("Clear chat failed:", error);
        res.status(500).json({ error: "Chat konnte nicht gelöscht werden." });
    }
});

app.delete("/api/chat/contacts/:contactId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { contactId } = req.params;

    try {
        await prisma.chatMessage.deleteMany({ where: { contactId } });
        await prisma.chatContact.delete({ where: { id: contactId } });
        res.json({ success: true });
    } catch (error) {
        console.error("Delete contact failed:", error);
        res.status(500).json({ error: "Kontakt konnte nicht gelöscht werden." });
    }
});