# Webapplikation SS2026 CampusRide

**Autoren:** Marlin Wießenenberg, Paul Boos, Robin Dietsche
**Datum:** 24. Juli 2026

---

# Einleitung

## Motivation

//TODO

## Kernfunktionen

CampusRide ist eine Ridesharing-Webapp ausschließlich für Studenten. Sie ermöglicht es, Fahrten anzubieten und zu finden sowie miteinander in Kontakt zu treten, um die genauen Details der Fahrt zu besprechen.

Da wir uns entschieden haben, dass CampusRide (wenn es ein echtes Produkt wäre) ein Non-Profit-Projekt wäre, überlassen wir den Nutzern die vollständige Freiheit über die Preisverhandlungen.

Der Hauptzweck dieser Fahrten ist der regelmäßige Transit von und zum Campus. Andere Fahrten sind jedoch ebenfalls möglich.

CampusRide verfügt über einen In-App-Chat, der die Verbindung zwischen Fahrern und Mitfahrern einfacher und sicherer macht. Dieser ist über den Avater des Fahrers auf jedes Fahrt-Listing erreichbar.

Bei der Suche und beim Anbieten von Fahrten wird OpenStreetMap integriert, um die Fahrt visuell darzustellen. Diese Routenansicht basiert ausschließlich auf Start- und Endpunkt der Fahrt und ist nicht bindend. 

Um zu garantieren das nur Studenten die webapp benutzen wird bei der Registrierung die email provider mit einer öffentlich verfügbaren Datenbank verglichen. 



























---

# Technologie-Stack

## Verwendete Technologien


 Zusammenfassung der erzwungenen Technologien: HTML5 (semantisch),       
     CSS3 (Flexbox/Grid, Media Queries), npm, Vite (Bundler), TypeScript,    
     React (Hooks, Context, Router), Express (Node.js), REST, SQLite/        
     PostgreSQL/MongoDB, JWT, Vitest, Docker Compose. 

### React 
### Express.js

Express ist das Backend-Framework. Es bietet einen schlanken, flexiblen Ansatz für die Erstellung von REST-APIs. Alle Endpunkte sind in einer einzigen Datei (`app.ts`) organisiert, was die Übersichtlichkeit für ein Projekt dieser Größe erhält.

### Prisma

Prisma wird als Datenbank-ORM verwendet siehe Aufgabe besagt.

### OpenStreetMap

OpenStreetMap wird zur Darstellung von Fahrtrouten verwendet nicht für die Fahrt auswahl

Gründe für die Auswahl:

- kostenlos anders als die api von google maps
- hilfreiche Tools die wir ursprünglich für eine verbesserte Suche gebraucht hätten
- nix anderes eingefallen auser OSM und google maps

### express-rate-limit

`express-rate-limit` ist installiert wird aber nicht verwendet(hat mich beim testen von anderen Sachen aufgeregt) 

Es sollte die Anwendung vor Denial-of-Service-Angriffen schützen.


### jsonwebtoken und bcryptjs

JWTs (JSON Web Tokens) werden für die Authentifizierung verwendet. Nach dem Login erhält der Client ein Token mit einer Gültigkeit von zwei Stunden. Für geschützte Anfragen wird dieses Token im `Authorization`-Header als `Bearer`-Token mitgesendet.

bcryptjs übernimmt das Hashing der Passwörter mit einem Salt-Faktor von 10 Runden. Passwörter werden niemals im Klartext gespeichert.

### academic-email-verifier

Bei der Registrierung wird die E-Mail-Adresse des Nutzers mit einer öffentlich verfügbaren Datenbank akademischer Domains abgeglichen. Nur Nutzer mit einer gültigen Universitäts-E-Mail-Adresse (z.B. `@uni-konstanz.de`, `@htwg-konstanz.de`) können sich registrieren. Dies stellt sicher, dass CampusRide ausschließlich von Studenten genutzt wird. 

### Docker Compose

Docker Compose ermöglicht das einheitliche Deployen der gesamten Anwendung (Frontend und Backend als separate Container) mit einem einzigen Befehl. Das Backend führt bei jedem Start automatisch Prisma-Migrationen aus und startet den Server. Das Frontend wird im Dev-Modus mit Vite gestartet.

### Vitest und Supertest

Vitest dient als Testframework für die Backend-Tests. Supertest ermöglicht das Testen von Express-Endpunkten ohne einen laufenden Server. Die Tests simulieren HTTP-Anfragen und prüfen die korrekte Antwort des Backends.

































---

# Architektur

## Aufbau der Anwendung

Beschreibung der:

- Komponentenstruktur
- API-Architektur
- Datenbankstruktur

Diagramme:

- Komponentenbaum
- ER-Diagramm
- Sequenzdiagramm für einen Request

Geplanter Umfang:

**3–4 Seiten**

---












# Umsetzung

Für jeden Meilenstein:

- Was wurde umgesetzt?
- Welche Konzepte aus den Vorlesungen wurden verwendet?
- Wo sind diese Konzepte im Code sichtbar?

Kurze Code-Ausschnitte können eingefügt werden.

Keine vollständigen Listings.

Geplanter Umfang:

**6–8 Seiten**




















---



# Betrieb

Beschreibung des Betriebs der Anwendung:

- Wie wird die Anwendung gestartet?
- Welche Umgebung wird verwendet?
- Docker-Compose oder README-Anleitung

Geplanter Umfang:

**1–2 Seiten**

docker compose up --build in sowohl /react-app/server ;/react-app/











---

# Reflexion & Fazit

Diskussion über:

- Was lief gut?
- Was würde beim nächsten Mal anders gemacht werden?
- Was wurde gelernt?


OpenStreetMap wird aktuell nicht zur auswahl von  Start- und Endpunkt verwendet wäre eine mögliche verbesserung

Chat könnte gruppenchat für die fahrt sein wäre aber komplexer

bessere Suche

nicht mehr zeugs so übel aufschieben


Geplanter Umfang:

**2 Seiten**

---

# Anhang

Enthält:

- Screenshots der fertigen Anwendung
- wichtigste Ansichten
- optionale Installationsanleitung
- API-Dokumentation
