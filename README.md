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
| Semantische HTML-Struktur | index.html | Z. 10–65 |
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
| TypeScript aktiv genutzt | `src/contexts/ridecontext.tsx`; `src/contexts/usercontext.tsx` | Z. 9–34 Interfaces/Types; Z. 3–40 User-/Auth-Typen |
| Komponentenzerlegung | `src/pages/find_ride/rideCard.tsx`; `src/pages/chat/chat.tsx` | Z. 30 `RideCard`; Z. 54 `ContactItem`, Z. 79 `MessageRow`, Z. 112 `ChatInput` |
| Props-Übergabe | `src/pages/find_ride/rideCard.tsx`; `src/pages/profile/profile.tsx` | Z. 4–8 Props-Typ; Z. 28–48 Props-Interfaces |
| useState | `src/pages/create_ride/create_ride.tsx`; `src/pages/home/home.tsx` | Z. 141 Formular-State; Z. 43 ausgewählte Fahrt |
| useEffect | `src/contexts/ridecontext.tsx`; `src/pages/home/RouteMapFromCoords.tsx` | Z. 72 localStorage speichern; Z. 43 Map-Bounds aktualisieren |
| Durchgängige Nutzeraktion | `src/pages/create_ride/create_ride.tsx`; `src/pages/home/home.tsx` | Z. 162–188 Fahrt anlegen; Z. 92 Fahrt anklicken → Map-Auswahl |

