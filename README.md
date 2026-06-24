Car Pooling Programm for students to drive from and to uni
Allows diffrent start and end Points of the driver and the ones getting driven.
Allows for drivers to limit the amount of Detours they are willing to take to collect and deliver the passengers

Git link = https://github.com/Robdipi/Webapplikation_Uni_carPooling_app

Our Group:
|Name|MatrikelNr|Githubname|
|---|---|---|
|Robin Dietsche|315081|Robdipi|
|Marlin Wießenberg|315344|marlinw-media|
|Paul Boos|315053| Palimus1|

Zuordnungstabelle:
| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| Semantische HTML-Struktur | index.html | Z. 10-65 |
| Formular mit Labels | index.html | Z. 26-51 |
| Responsives Layout (Flexbox/Grid) | styles.css | Z. 30-91 |
| Media Query | styles.css | Z. 94-98 |
| URL-Struktur | index.html, home.html chat.html | Pfade: /index, /home, /chat.html home ist erreichbar nach Anmeldung in index.html, chat ist von home.html erreichbar |


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

### Setup Frontend

```bash
cd react-app
npm install
npm run dev
```

Das Frontend läuft standardmäßig unter `http://localhost:5173`.

### Setup Backend

```bash
cd react-app/server
npm install
```

Im Ordner `react-app/server` muss lokal eine `.env`-Datei angelegt werden. Als Vorlage dient `react-app/server/.env.example`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="campusride-dev-secret"
```

Danach die lokale SQLite-Datenbank erzeugen und den Prisma Client generieren:

```bash
npx prisma migrate dev
npx prisma generate
```

Backend starten:

```bash
npm run dev
```

Das Backend läuft standardmäßig unter `http://localhost:3001`.

### Tests ausführen

```bash
cd react-app/server
npm test
```

### Testuser / Test-Credentials

Empfohlener Testuser für die Vorführung:

| Feld | Wert |
|---|---|
| E-Mail | `demo@example.com` |
| Benutzername | `demouser` |
| Passwort | `12345` |
| Vorname | `Demo` |
| Nachname | `User` |
| Geburtstag | `2000-01-01` |
| Studiengang | `AIN` |

Damit kann der Login mit `demo@example.com` oder `demouser` und dem Passwort `12345` getestet werden.

### Architektur

```text
React SPA (Vite, BrowserRouter, Context)
        |
        | fetch / HTTP JSON
        v
Express API Backend (Node.js, Port 3001)
        |
        | Prisma ORM
        v
SQLite Datenbank (dev.db, lokal erzeugt)
```

Die Anwendung ist als Single Page Application umgesetzt. SSR oder SSG ist für diesen Stand nicht nötig, weil CampusRide vor allem eine interaktive Anwendung mit Login, Formularen, Kartenansicht und nutzerspezifischem Zustand ist. Suchmaschinenoptimierung oder statisch vorgerenderte Inhaltsseiten stehen hier nicht im Vordergrund.

### REST-Endpunkte

| Methode | Pfad | Zweck | Schutz |
|---|---|---|---|
| GET | `/api/health` | Prüft, ob das Backend läuft | öffentlich |
| GET | `/api/db-status` | Prüft die Verbindung zur SQLite-Datenbank und zählt User | öffentlich |
| POST | `/api/auth/register` | Registriert einen neuen User und speichert ihn persistent | öffentlich |
| POST | `/api/auth/login` | Prüft Login-Daten und gibt ein JWT zurück | öffentlich |
| GET | `/api/auth/me` | Gibt den aktuell eingeloggten User anhand des JWT zurück | geschützt, `Authorization: Bearer <token>` |

### Kriterien-Zuordnung M3

| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| React Router mit mehreren Routen | `react-app/src/main.tsx`; `react-app/src/routes/AppRoutes.tsx` | `BrowserRouter` in Z. 3 und Z. 15-17; Routen `/`, `/home`, `/chat`, `/create-ride`, `/find-ride`, `/profile`, `/impressum` und 404 in Z. 14-66 |
| Navigation über React Router | `react-app/src/StartPage.tsx`; `react-app/src/routes/AppRoutes.tsx` | `useNavigate` nach Login/Register in Z. 6, Z. 26 und Z. 49; Redirects mit `Navigate` in `AppRoutes.tsx` Z. 26, Z. 45 und Z. 55 |
| Eigener API-Zugriff aus dem Frontend | `react-app/src/api/authApi.ts` | Fetch gegen eigenes Backend `http://localhost:3001/api` in Z. 35; Register/Login/Me Requests in Z. 46-91 |
| REST: GET und POST | `react-app/src/api/authApi.ts`; `react-app/server/src/app.ts` | Frontend nutzt POST `/auth/register`, POST `/auth/login` und GET `/auth/me` in Z. 46-91; Backend-Endpunkte in `app.ts` Z. 107-319 |
| Fehlerzustände sichtbar | `react-app/src/api/authApi.ts`; `react-app/src/StartPage.tsx` | API-Fehler werden aus Response gelesen und geworfen in `authApi.ts` Z. 37-44 und Z. 55-87; Login-/Registrierungsfehler werden sichtbar angezeigt in `StartPage.tsx` Z. 104-108 und Z. 218-222 |
| Ladezustand sichtbar | `react-app/src/contexts/usercontext.tsx`; `react-app/src/routes/ProtectedRoute.tsx` | Beim Wiederherstellen des eingeloggten Users wird `isAuthLoading` gesetzt in Z. 121-147; `ProtectedRoute` zeigt währenddessen `Authentifizierung wird geprüft...` in Z. 9-15 |
| Geteilter State über Context | `react-app/src/contexts/AppProviders.tsx`; `react-app/src/contexts/usercontext.tsx` | Provider-Struktur in Z. 11-19; app-weiter User/Auth-State mit `currentUser`, `authToken`, `isLoggedIn`, `loginUser`, `registerUser`, `logoutUser` in `usercontext.tsx` Z. 115-252 |
| Backend mit Express | `react-app/server/src/app.ts`; `react-app/server/src/index.ts` | Express-App, JSON Middleware und CORS in `app.ts` Z. 17-20; Serverstart in `index.ts` Z. 1-7 |
| Persistente Datenbank | `react-app/server/prisma/schema.prisma`; `react-app/server/src/app.ts` | SQLite-Datasource und User-Modell in `schema.prisma` Z. 1-23; PrismaClient mit SQLite-Adapter in `app.ts` Z. 11-15 |
| Registrierung | `react-app/server/src/app.ts`; `react-app/src/StartPage.tsx` | Backend-Route `POST /api/auth/register` in `app.ts` Z. 133-221; Formular ruft `registerUser` auf in `StartPage.tsx` Z. 29-50 und Z. 127-225 |
| Login | `react-app/server/src/app.ts`; `react-app/src/StartPage.tsx` | Backend-Route `POST /api/auth/login` in `app.ts` Z. 223-281; Formular ruft `loginUser` auf in `StartPage.tsx` Z. 11-27 und Z. 78-111 |
| Passwort-Hashing | `react-app/server/src/app.ts` | Passwort wird mit bcrypt gehasht in Z. 194; Login vergleicht Passwort mit Hash in Z. 259 |
| JWT konsequent eingesetzt | `react-app/server/src/app.ts`; `react-app/src/contexts/usercontext.tsx`; `react-app/src/api/authApi.ts` | JWT-Erzeugung in `app.ts` Z. 46-56; Tokenprüfung in Z. 73-105; Token wird im Frontend gesetzt und genutzt in `usercontext.tsx` Z. 118-147, Z. 169-172, Z. 200-203; Authorization Header in `authApi.ts` Z. 78-83 |
| Geschützter Endpunkt | `react-app/server/src/app.ts` | `GET /api/auth/me` nutzt `authenticateToken` in Z. 283-319 |
| Geschützte Frontend-Routen | `react-app/src/routes/ProtectedRoute.tsx`; `react-app/src/routes/AppRoutes.tsx` | Nicht eingeloggte User werden zu `/` geleitet in `ProtectedRoute.tsx` Z. 9-21; `/home`, `/chat`, `/create-ride`, `/find-ride`, `/profile` sind geschützt in `AppRoutes.tsx` Z. 18-64 |
| Tests | `react-app/server/src/app.test.ts`; `react-app/server/package.json` | 4 API-Tests für Health, geschützten Endpoint, Register/Login und falsches Passwort in Z. 9-103; Testskripte `npm test` und `npm run test:watch` in `package.json` Z. 7-12 |
| Keine echten Secrets im Repository | `.gitignore`; `react-app/server/.env.example` | `.env` wird ignoriert; `.env.example` enthält nur lokale Beispielwerte |

### Kurzbeschreibung der Authentifizierung

Bei der Registrierung werden die Formulardaten an `POST /api/auth/register` gesendet. Das Backend prüft Pflichtfelder, verhindert doppelte E-Mail-Adressen oder Benutzernamen, hasht das Passwort mit bcrypt und speichert den User über Prisma in SQLite. Danach wird ein JWT erzeugt und zusammen mit den öffentlichen Userdaten ans Frontend zurückgegeben.

Beim Login sendet das Frontend Benutzername/E-Mail und Passwort an `POST /api/auth/login`. Das Backend sucht den User, vergleicht das Passwort mit dem gespeicherten Hash und gibt bei Erfolg wieder ein JWT zurück. Für geschützte Anfragen wird das Token im `Authorization`-Header als `Bearer`-Token gesendet. Der Endpunkt `GET /api/auth/me` und die geschützten Frontend-Routen zeigen, dass nicht angemeldete Nutzer blockiert werden.