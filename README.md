# CampusRide

**Team:**

| Name | MatrikelNr | Githubname |
| --- | --- | --- |
| Robin Dietsche | 315081 | Robdipi |
| Marlin Wießenberg | 315344 | marlinw-media |
| Paul Boos | 315053 | Palimus1 |

**Repository:** https://github.com/Robdipi/Webapplikation_Uni_carPooling_app

## Projektidee

CampusRide ist eine Ridesharing-Webapp ausschließlich für Studenten.
Sie ermöglicht es, Fahrten von und zur Universität anzubieten und zu finden (andere gehen auch)
. Fahrer können die maximal erlaubten Umwege begrenzen. Ein In-App-Chat erleichtert die Kontaktaufnahme zwischen Fahrern und Mitfahrern. Die Registrierung ist auf akademische E-Mail-Adressen beschränkt.

## Bekannte Einschränkungen

- **Kein Echtzeit-Chat**: Der Chat basiert auf Polling (regelmäßige Anfragen an das Backend). Nachrichten anderer Nutzer werden erst beim nächsten Polling-Intervall sichtbar. Ein WebSocket-basierter Echtzeit-Chat wäre eine mögliche Verbesserung.
- **OpenStreetMap nur zur Anzeige**: Die Karte zeigt die Route zwischen Start- und Zielpunkt, wird aber nicht zur Auswahl dieser Punkte verwendet. Start und Ziel müssen manuell als Text eingegeben werden.
- **Kein Gruppenchat**: Chats sind immer 1:1 zwischen zwei Personen. Ein Gruppenchat für alle Mitfahrer einer Fahrt wäre wünschenswert, aber deutlich komplexer.
- **Eingeschränkte Suchfunktion**: Die Suche filtert nur nach Start, Ziel, Datum und Uhrzeit. Erweiterte Filter (z. B. maximale Entfernung, Preisbereich, Zwischenstopps) sind nicht vorhanden.
- **express-rate-limit nicht aktiviert**: Die Bibliothek `express-rate-limit` ist installiert, wird aber nicht verwendet. Dadurch fehlt ein Schutz vor DoS-Angriffen auf die API.
- **Kein Integrietest Zahlungsystem**: wir überlassen dem user wie er sich um die zahlung kümmert
- **Schlechtes Preis System**: Preis ist in den Profil einstellungen als Kilometer preis anstatt bei jeder Fahrt mit dabei.
## Demo-Video

https://youtu.be/Xr-0pmRnFbQ

## Setup mit Docker Compose (empfohlen)

```bash
docker compose up --build
```

Dies startet zwei Container:
- **Frontend (Client)** auf `http://localhost:5173`
- **Backend (Server)** auf `http://localhost:3001`

Das Backend führt beim Start automatisch Prisma-Migrationen aus und legt Seed-Daten an (4 Testbenutzer, 1 Beispiel-Fahrt). Die SQLite-Datenbank wird in einem Docker-Volume persistiert, sodass Daten über Container-Neustarts hinweg erhalten bleiben.

## Manuelles Setup (Entwicklung)

### Frontend

```bash
cd react-app
npm install
npm run dev
```

Das Frontend läuft unter `http://localhost:5173`.

### Backend

```bash
cd react-app/server
npm install
```

Im Ordner `react-app/server` muss eine `.env`-Datei angelegt werden. Als Vorlage dient `.env.example`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="campusride-dev-secret"
```

Dann die SQLite-Datenbank erzeugen und Prisma Client generieren:

```bash
npx prisma migrate dev
npx prisma generate
```

Backend starten:

```bash
npm run dev
```

Das Backend läuft unter `http://localhost:3001`.

### Tests ausführen

```bash
cd react-app/server
npm test
```

## Testuser / Zugangsdaten

Nach dem Start mit Docker Compose oder nach manuellem Seeding (`npm run dev`) sind folgende Accounts verfügbar:

| E-Mail | Benutzername | Passwort | Vorname | Nachname | Studiengang |
|---|---|---|---|---|---|
| `lisa.m@htwg-konstanz.de` | `lisa_m` | `CampusRide1` | Lisa | Müller | WI |
| `max.w@uni-konstanz.de` | `max_w` | `CampusRide1` | Max | Weber | AIN |
| `sarah.f@htwg-konstanz.de` | `sarah_f` | `CampusRide1` | Sarah | Fischer | MCL |
| `jonas.k@uni-konstanz.de` | `jonas_k` | `CampusRide1` | Jonas | Klein | AIN |

Zusätzlich kann ein eigener Account über das Registrierungsformular erstellt werden (nur mit akademischer E-Mail-Adresse).

## Architektur

```text
React SPA (Vite, BrowserRouter, Context)
        |
        | fetch / HTTP JSON
        v
Express API Backend (Node.js, Port 3001)
        |
        | Prisma ORM
        v
SQLite Datenbank (dev.db, persistent via Docker-Volume)
```

Die Anwendung ist als Single Page Application umgesetzt. SSR oder SSG ist nicht nötig, da CampusRide eine interaktive Anwendung mit Login, Formularen, Kartenansicht und nutzerspezifischem Zustand ist. Suchmaschinenoptimierung steht nicht im Vordergrund.

## REST-Endpunkte

| Methode | Pfad | Zweck | Schutz |
|---|---|---|---|
| GET | `/api/health` | Prüft, ob das Backend läuft | öffentlich |
| GET | `/api/db-status` | Prüft die Verbindung zur SQLite-Datenbank | öffentlich |
| POST | `/api/auth/register` | Registriert einen neuen User | öffentlich |
| POST | `/api/auth/login` | Prüft Login-Daten und gibt ein JWT zurück | öffentlich |
| GET | `/api/auth/me` | Gibt den aktuell eingeloggten User zurück | geschützt |
| PUT | `/api/auth/me` | Aktualisiert das Profil des eingeloggten Users | geschützt |
| GET | `/api/rides` | Liste aller Fahrten (mit optionalen Query-Parametern) | geschützt |
| POST | `/api/rides` | Neue Fahrt anlegen | geschützt |
| PUT | `/api/rides/:id` | Fahrt aktualisieren (nur Fahrer) | geschützt |
| DELETE | `/api/rides/:id` | Fahrt löschen (nur Fahrer) | geschützt |
| GET | `/api/chats/contacts` | Chat-Kontakte des eingeloggten Users | geschützt |
| POST | `/api/chats/contacts/:userId` | Chat-Kontakt anlegen | geschützt |
| GET | `/api/chats/:contactId/messages` | Nachrichten mit einem Kontakt | geschützt |
| POST | `/api/chats/:contactId/messages` | Nachricht senden | geschützt |
| DELETE | `/api/chats/:contactId` | Chat-Kontakt entfernen | geschützt |

## M1 – Projektstart & Fundament

### Kriterien-Zuordnung M1

| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| Semantische HTML-Struktur | index.html | Z. 10-65 |
| Formular mit Labels | index.html | Z. 26-51 |
| Responsives Layout (Flexbox/Grid) | styles.css | Z. 30-91 |
| Media Query | styles.css | Z. 94-98 |
| URL-Struktur | index.html, home.html, chat.html | Pfade: /index, /home, /chat.html |

## M2 – React-Umbau & Interaktion

### Setup

```bash
npm install
npm run dev
```

Die App läuft unter `http://localhost:5173`.

### Kriterien-Zuordnung M2

| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| npm + Vite | `react-app/package.json`, `react-app/vite.config.ts` | Projekt-Root; `npm install`, `npm run dev` |
| TypeScript aktiv genutzt | `src/contexts/ridecontext.tsx`; `src/contexts/usercontext.tsx` | Z. 9-34 Interfaces/Types; Z. 3-40 User-/Auth-Typen |
| Komponentenzerlegung | `src/pages/find_ride/rideCard.tsx`; `src/pages/chat/chat.tsx` | Z. 30 `RideCard`; Z. 54 `ContactItem`, Z. 79 `MessageRow`, Z. 112 `ChatInput` |
| Props-Übergabe | `src/pages/find_ride/rideCard.tsx`; `src/pages/profile/profile.tsx` | Z. 4-8 Props-Typ; Z. 28-48 Props-Interfaces |
| useState | `src/pages/create_ride/create_ride.tsx`; `src/pages/home/home.tsx` | Z. 141 Formular-State; Z. 43 ausgewählte Fahrt |
| useEffect | `src/contexts/ridecontext.tsx`; `src/pages/home/RouteMapFromCoords.tsx` | Z. 72 localStorage speichern; Z. 43 Map-Bounds aktualisieren |
| Durchgängige Nutzeraktion | `src/pages/create_ride/create_ride.tsx`; `src/pages/home/home.tsx` | Z. 162-188 Fahrt anlegen; Z. 92 Fahrt anklicken -> Map-Auswahl |

## M3 – Daten, Routing, REST, Qualität & Backend

### Kriterien-Zuordnung M3

| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| React Router mit mehreren Routen | `react-app/src/main.tsx`; `react-app/src/routes/AppRoutes.tsx` | `BrowserRouter` in Z. 3 und Z. 15-17; Routen `/`, `/home`, `/chat`, `/create-ride`, `/find-ride`, `/profile`, `/impressum` und 404 in Z. 14-66 |
| Navigation über React Router | `react-app/src/StartPage.tsx`; `react-app/src/routes/AppRoutes.tsx` | `useNavigate` nach Login/Register in Z. 6, Z. 26, Z. 49; Redirects mit `Navigate` in Z. 26, Z. 45, Z. 55 |
| Eigener API-Zugriff aus dem Frontend | `react-app/src/api/authApi.ts` | Fetch gegen `http://localhost:3001/api` in Z. 35 |
| REST: GET und POST | `react-app/src/api/authApi.ts`; `react-app/server/src/app.ts` | POST `/auth/register`, POST `/auth/login`, GET `/auth/me` |
| Fehlerzustände sichtbar | `react-app/src/api/authApi.ts`; `react-app/src/StartPage.tsx` | API-Fehler werden gelesen und geworfen in Z. 37-44, Z. 55-87; Fehleranzeige in Z. 104-108, Z. 218-222 |
| Ladezustand sichtbar | `react-app/src/contexts/usercontext.tsx`; `react-app/src/routes/ProtectedRoute.tsx` | `isAuthLoading` in Z. 121-147; `Authentifizierung wird geprüft...` in Z. 9-15 |
| Geteilter State über Context | `react-app/src/contexts/AppProviders.tsx`; `react-app/src/contexts/usercontext.tsx` | Provider-Struktur in Z. 11-19; User/Auth-State mit `currentUser`, `authToken`, `isLoggedIn`, `loginUser`, `registerUser`, `logoutUser` in Z. 115-252 |
| Backend mit Express | `react-app/server/src/app.ts`; `react-app/server/src/index.ts` | Express-App, JSON-Middleware, CORS in `app.ts` Z. 17-20; Serverstart in `index.ts` Z. 1-7 |
| Persistente Datenbank | `react-app/server/prisma/schema.prisma`; `react-app/server/src/app.ts` | SQLite-Datasource und Modelle in `schema.prisma`; PrismaClient in `app.ts` Z. 11-15 |
| Registrierung | `react-app/server/src/app.ts`; `react-app/src/StartPage.tsx` | Backend `POST /api/auth/register` in Z. 133-221; Formular ruft `registerUser` auf |
| Login | `react-app/server/src/app.ts`; `react-app/src/StartPage.tsx` | Backend `POST /api/auth/login` in Z. 223-281; Formular ruft `loginUser` auf |
| Passwort-Hashing | `react-app/server/src/app.ts` | bcrypt-Hash bei Registrierung in Z. 194; Vergleich bei Login in Z. 259 |
| JWT konsequent eingesetzt | `react-app/server/src/app.ts`; `react-app/src/contexts/usercontext.tsx`; `react-app/src/api/authApi.ts` | JWT-Erzeugung in Z. 46-56; Tokenprüfung in Z. 73-105; Token im Frontend in `usercontext.tsx` Z. 118-147, Z. 169-172, Z. 200-203; `Authorization`-Header in `authApi.ts` Z. 78-83 |
| Geschützter Endpunkt | `react-app/server/src/app.ts` | `GET /api/auth/me` nutzt `authenticateToken` in Z. 283-319 |
| Geschützte Frontend-Routen | `react-app/src/routes/ProtectedRoute.tsx`; `react-app/src/routes/AppRoutes.tsx` | Nicht eingeloggte User werden zu `/` geleitet in `ProtectedRoute.tsx` Z. 9-21; `/home`, `/chat`, `/create-ride`, `/find-ride`, `/profile` sind geschützt |
| Tests | `react-app/server/src/app.test.ts`; `react-app/server/package.json` | 17 API-Tests für Health, Auth, Rides, Chats, Berechtigungen; Skripte `npm test` und `npm run test:watch` |
| Keine echten Secrets im Repository | `.gitignore`; `react-app/server/.env.example` | `.env` wird ignoriert; `.env.example` enthält nur lokale Beispielwerte |

### Kurzbeschreibung der Authentifizierung

Bei der Registrierung werden die Formulardaten an `POST /api/auth/register` gesendet. Das Backend prüft Pflichtfelder, verhindert doppelte E-Mail-Adressen oder Benutzernamen, prüft die E-Mail auf eine akademische Domain, hasht das Passwort mit bcrypt und speichert den User über Prisma in SQLite. Danach wird ein JWT erzeugt und zusammen mit den öffentlichen Userdaten ans Frontend zurückgegeben.

Beim Login sendet das Frontend Benutzername/E-Mail und Passwort an `POST /api/auth/login`. Das Backend sucht den User, vergleicht das Passwort mit dem gespeicherten Hash und gibt bei Erfolg wieder ein JWT zurück. Für geschützte Anfragen wird das Token im `Authorization`-Header als `Bearer <token>` gesendet. Der Endpunkt `GET /api/auth/me` und die geschützten Frontend-Routen zeigen, dass nicht angemeldete Nutzer blockiert werden.
