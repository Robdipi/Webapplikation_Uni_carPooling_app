# Webapplikation SS2026 CampusRide

**Autoren:** Marlin Wießenenberg, Paul Boos, Robin Dietsche
**Datum:** 24. Juli 2026

---

# Einleitung

CampusRide ist eine Ridesharing-Webapp ausschließlich für Studenten. Sie ermöglicht es, Fahrten anzubieten und zu finden sowie miteinander in Kontakt zu treten, um die genauen Details der Fahrt zu besprechen.

Da wir uns entschieden haben, dass CampusRide (wenn es ein echtes Produkt wäre) ein Non-Profit-Projekt wäre, überlassen wir den Nutzern die vollständige Freiheit über die Preisverhandlungen.

Der Hauptzweck dieser Fahrten ist der regelmäßige Transit von und zum Campus. Andere Fahrten sind jedoch ebenfalls möglich.

CampusRide verfügt über einen In-App-Chat, der die Verbindung zwischen Fahrern und Mitfahrern einfacher und sicherer macht. Dieser ist über jedes Fahrt-Listing erreichbar.

Bei der Suche und beim Anbieten von Fahrten wird OpenStreetMap integriert, um die Fahrt visuell darzustellen. Diese Routenansicht basiert ausschließlich auf Start- und Endpunkt der Fahrt und ist nicht bindend.

---

# Technologie-Stack

Übersicht der eingesetzten Technologien:

- Frontend
- Backend
- Datenbank
- Tooling

Kurze Begründung der Wahl der Technologien.

## Verwendete Technologien

### Prisma

Prisma wird als Datenbank-ORM verwendet. Es erleichtert die Kommunikation zwischen Anwendung und Datenbank und ermöglicht eine typsichere Verwaltung der Datenmodelle.

### OpenStreetMap

OpenStreetMap wird zur Darstellung von Fahrtrouten verwendet.

Gründe für die Auswahl:

- kostenlos nutzbar
- offene Datenbasis
- viele verfügbare Tools und Erweiterungen
- keine Abhängigkeit von proprietären Kartendiensten

### express-rate-limit

`express-rate-limit` wird als Sicherheitsmechanismus eingesetzt.

Es schützt die Anwendung vor übermäßigen Anfragen und reduziert das Risiko von Denial-of-Service-Angriffen.

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

# Testing & Qualitätssicherung

Beschreibung der Teststrategie:

- Was wird getestet?
- Was wird nicht getestet und warum?
- Welche Testabdeckung wurde erreicht?
- Beispielhafte Testergebnisse

Geplanter Umfang:

**2 Seiten**

---

# Betrieb

Beschreibung des Betriebs der Anwendung:

- Wie wird die Anwendung gestartet?
- Welche Umgebung wird verwendet?
- Docker-Compose oder README-Anleitung

Geplanter Umfang:

**1–2 Seiten**

---

# Reflexion & Fazit

Diskussion über:

- Was lief gut?
- Was würde beim nächsten Mal anders gemacht werden?
- Was wurde gelernt?

Geplanter Umfang:

**2 Seiten**

---

# Anhang

Enthält:

- Screenshots der fertigen Anwendung
- wichtigste Ansichten
- optionale Installationsanleitung
- API-Dokumentation
