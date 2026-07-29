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

## Meilenstein 1 – Projektstart und Fundament

Der erste Meilenstein hatte das Ziel, die Grundidee von CampusRide als statischen HTML- und CSS-Prototyp umzusetzen. Zu diesem Zeitpunkt gab es noch kein React-Frontend, kein Backend und keine Datenbank. Im Vordergrund standen deshalb die Struktur der Anwendung, die wichtigsten Ansichten, eine konsistente Gestaltung und eine nachvollziehbare Navigation. Der damalige Stand ist im Git-Tag **Meilenstein_1** festgehalten.

### Aufbau des statischen Prototyps

Die Anwendung bestand aus mehreren HTML-Seiten, die bereits die späteren Kernbereiche von CampusRide abbildeten. Die zentrale Einstiegsseite befand sich in `html/index.html`. Daneben gab es unter anderem eigene Seiten für die Fahrtübersicht (`html/home/home.html`), die Fahrtensuche (`html/find_ride/find_ride.html`), das Anbieten einer Fahrt (`html/create_ride/create_ride.html`), den Chat (`html/chat/chat.html`), das Profil (`html/profile/profile.html`) und das Impressum (`html/impressum/impressum.html`).

Damit war schon im ersten Meilenstein die grundlegende Informationsarchitektur der Anwendung erkennbar. Nutzer sollten sich auf der Startseite anmelden oder registrieren und anschließend zwischen Home, Chat, Fahrt anbieten, Fahrt finden und Profil wechseln können. Die Inhalte waren zu diesem Zeitpunkt noch statisch. Beispielsweise zeigte die Startseite nach der Anmeldung eine fest eingetragene Fahrt von Bremen nach Hannover mit einer Beispielkarte und einem Beispielprofil. Auch die Chatnachrichten und Profildaten waren reine Platzhalter.

### Semantisches HTML

Ein Schwerpunkt des Meilensteins war die Verwendung semantischer HTML-Elemente. In `html/index.html` wurden die Bereiche der Seite mit `header`, `nav`, `main`, `article`, `section` und `footer` gegliedert. Dadurch wurde nicht nur das Aussehen, sondern auch die Bedeutung der einzelnen Bereiche im Quellcode sichtbar. Die Fahrt auf der Home-Seite wurde beispielsweise innerhalb eines `article`-Elements dargestellt, da sie als eigenständiger Inhalt betrachtet werden kann.

Weitere semantische Elemente wurden auf den Unterseiten eingesetzt. In `html/create_ride/create_ride.html` enthält der Hauptbereich neben dem Formular ein `aside` mit Hinweisen für Fahrer. Das Impressum verwendet mehrere `section`-Elemente sowie `address` für die Adressangaben. Diese Struktur verbesserte die Lesbarkeit des Codes und schuf zugleich eine geeignete Grundlage für Barrierefreiheit und spätere Weiterentwicklung.

### Formulare und vorbereitete Nutzeraktionen

Bereits in M1 wurden mehrere Formulare entworfen. Die Startseite enthielt jeweils ein Formular für Login und Registrierung. Weitere Formulare wurden für die Fahrtensuche, das Erstellen einer Fahrt und das Schreiben einer Chatnachricht vorbereitet. Die Eingabefelder waren über `label`-Elemente mit den jeweiligen Feldern verknüpft. Zusätzlich wurden `name`-Attribute verwendet, sodass die Formulardaten später grundsätzlich verarbeitet werden konnten. Pflichtfelder waren mit `required` gekennzeichnet und teilweise durch passende Typen wie `date`, `time`, `datetime-local`, `number` oder `password` eingeschränkt.

Eine echte Verarbeitung der Eingaben war in diesem Meilenstein noch nicht vorgesehen. Die Formulare für Login, Registrierung und das Anbieten einer Fahrt verwiesen nach dem Absenden lediglich auf eine andere statische HTML-Seite. Die Login- und Registrierungsfenster wurden ohne JavaScript über versteckte Checkboxen und CSS-Selektoren umgesetzt. In `html/popup.css` öffnet die Regel für `:checked` das jeweilige Overlay. Dadurch konnte bereits eine einfache sichtbare Interaktion demonstriert werden, obwohl laut Aufgabenstellung noch kein JavaScript erforderlich war.

### Gestaltung und responsives Layout

Die grundlegende Gestaltung wurde in `html/style.css` zentralisiert. Farben, Schatten und Farbverläufe wurden als CSS-Variablen im `:root`-Bereich definiert. Auf diese Weise konnten dieselben Markenfarben in unterschiedlichen Ansichten wiederverwendet werden. Der `body` wurde als vertikaler Flex-Container mit einer Mindesthöhe von `100vh` umgesetzt. Der Hauptbereich füllte dadurch den Platz zwischen Header und Footer aus. Auch der Header nutzte Flexbox, um Logo und Navigation horizontal anzuordnen.

Zusätzlich existierten seitenspezifische Stylesheets. `html/home/rout_recomendation.css` definierte das Karten- und Fahrtenlayout, `html/find_ride/searchbar.css` die Suchleiste und `html/create_ride/create_ride.css` das Formular samt Informationsbox. Der Chat wurde in `html/chat/chatstyle.css` mit CSS Grid aufgebaut. Dabei wurden feste Bereiche für Header, Kontaktliste, Nachrichtenbereich und Eingabezeile definiert. Somit kamen sowohl Flexbox als auch Grid in sinnvollen Anwendungsfällen zum Einsatz.

Für kleinere Bildschirme enthielt `html/style.css` eine Media Query bei maximal 600 Pixel Breite. Der Header wechselte dort von einer horizontalen zu einer vertikalen Anordnung. Weitere Layouts nutzten `flex-wrap` oder flexible Breiten, damit Inhalte bei geringerem Platz umbrechen konnten. Damit erfüllte der Prototyp bereits die grundlegenden Anforderungen an ein responsives Layout.

### URL-Struktur und Navigation

Die Navigation erfolgte in M1 über relative Dateipfade. Von der Startseite führte das Absenden des Loginformulars beispielsweise zu `home/home.html`. Von dort waren die übrigen Ansichten über Links wie `../chat/chat.html`, `../create_ride/create_ride.html` oder `../profile/profile.html` erreichbar. Diese Struktur war noch dokumentenbasiert, bildete aber bereits die späteren fachlichen Routen der Anwendung ab.

### Weiterentwicklung im finalen Projektstand

Die in M1 entwickelten Seiten wurden in den späteren Meilensteinen nicht verworfen, sondern schrittweise in React- und TypeScript-Dateien überführt. Die Startseite befindet sich jetzt in `react-app/src/StartPage.tsx`. Die übrigen Ansichten liegen unter `react-app/src/pages/`, beispielsweise in `home/home.tsx`, `find_ride/find_ride.tsx` und `create_ride/create_ride.tsx`. Die semantische Grundstruktur aus M1 ist dabei weiterhin erkennbar. In JSX werden lediglich angepasste Attributnamen wie `className` statt `class` und `htmlFor` statt `for` verwendet.

Wiederkehrende Bereiche wurden später als eigene React-Komponenten in `components/Header.tsx` und `components/Footer.tsx` ausgelagert. Die relative Navigation zwischen einzelnen HTML-Dateien wurde durch React Router und sprechende Pfade wie `/home`, `/chat`, `/create-ride` und `/find-ride` ersetzt. Diese Weiterentwicklungen gehören inhaltlich zu den späteren Meilensteinen. M1 lieferte dafür jedoch das visuelle und strukturelle Fundament: die wichtigsten Seiten, die Formulare, das responsive Layout und die grundlegende Benutzerführung von CampusRide.

---

## Meilenstein 2 – React-Umbau und Interaktion

Im zweiten Meilenstein wurde der statische HTML- und CSS-Prototyp aus M1 in eine interaktive React-Anwendung überführt. Ziel war es, die vorhandenen Seiten nicht nur optisch nachzubilden, sondern sie in wiederverwendbare Komponenten zu zerlegen, Daten mit TypeScript zu typisieren und sichtbare Nutzerinteraktionen mithilfe von React Hooks umzusetzen. Der damalige Stand ist im Git-Tag **Meilenstein_2** dokumentiert. Benötigte Daten werden noch im Browser verwaltet, da noch keine Datenbank im Backend vorhanden ist.

### Tooling und Einstieg in React

Für den Umbau wurde im Ordner `react-app` ein React-Projekt mit npm, Vite und TypeScript eingerichtet. Die benötigten Befehle wurden in `package.json` als Skripte hinterlegt. Mit `npm run dev` konnte die Anwendung über den Vite-Entwicklungsserver gestartet werden, während `npm run build` zunächst die TypeScript-Prüfung und anschließend den Produktions-Build ausführte.

Der Einstiegspunkt der Anwendung befindet sich in `src/main.tsx`. Dort wird die React-Anwendung mit `createRoot` in das Root-Element der HTML-Datei eingebunden. Zusätzlich werden die übergeordneten Context-Provider und der `BrowserRouter` um die eigentliche Anwendung gelegt. Dadurch standen gemeinsam genutzte Zustände und die Navigation in allen darunterliegenden Seiten zur Verfügung. Die statischen HTML-Dateien aus M1 wurden damit weitgehend durch TSX-Dateien ersetzt, während die vorhandenen CSS-Dateien weiterverwendet wurden.

### TypeScript und Datenmodelle

TypeScript wurde nicht nur für die Dateiendungen verwendet, sondern insbesondere zur Modellierung der Anwendungsdaten. In `src/contexts/ridecontext.tsx` beschreibt das Interface `Ride` eine Fahrt mit Start- und Zielort, Koordinaten, Entfernung, Fahrtdauer, Fahrer, Abfahrtszeit, freien Sitzplätzen und Preis. Der Typ `NewRide` wird mit `Omit<Ride, "id">` aus diesem Modell abgeleitet, da die ID erst beim Speichern erzeugt wird.

Weitere Datenmodelle wurden für Benutzerprofile und Chats definiert. `UserProfile`, `RegisteredUser`, `RegisterUserInput` und `LoginUserInput` legen in `usercontext.tsx` die Struktur von Nutzerdaten fest. In `chatcontext.tsx` werden Kontakte und Nachrichten durch `ChatContact` und `ChatMessage` beschrieben. Auch Komponenten-Props und Ereignisse sind typisiert. So erwartet `RideCard` über `RideCardProps` eine Fahrt sowie optional eine Auswahlfunktion, während die Profilseite für ihre Eingabekomponente den Feldnamen auf `keyof UserProfile` begrenzt. Dadurch konnten ungültige Datenübergaben bereits während der Entwicklung erkannt werden.

### Komponenten und Props

Die Seiten wurden in kleinere Komponenten mit klaren Aufgaben zerlegt. Ein wichtiges Beispiel ist `src/pages/find_ride/rideCard.tsx`. Die Komponente `RideCard` erhält eine Fahrt über Props und stellt daraus Fahrer, Strecke, Zeitpunkt, freie Plätze, Preis und Zusatzinformationen dar. Über die optionale Prop `onSelect` kann die übergeordnete Seite festlegen, was beim Anklicken einer Fahrt geschieht. Dieselbe Komponente wird sowohl auf der Home-Seite als auch in der Fahrtensuche verwendet.

Auch die Chatansicht zeigt die Zerlegung in wiederverwendbare Teile. In `src/pages/chat/chat.tsx` stellt `ContactItem` einen Kontakt in der Seitenleiste dar, `MessageRow` rendert eine einzelne gesendete oder empfangene Nachricht und `ChatInput` kapselt das Eingabefeld samt Sendevorgang. Die benötigten Daten und Callback-Funktionen werden jeweils über typisierte Props übergeben. Auf der Profilseite wurden mit `ProfileField` und `ProfileInput` getrennte Komponenten für die Anzeige und Bearbeitung eines Profilwerts umgesetzt.

### Lokaler Zustand und kontrollierte Formulare

React Hooks machten die zuvor statischen Seiten interaktiv. Besonders deutlich ist dies in `src/pages/create_ride/create_ride.tsx`. Die Eingaben für Start, Ziel, Zeitpunkt, Sitzplätze und Zusatzinformationen werden gemeinsam in einem mit `useState` verwalteten Formularobjekt gespeichert. Da die Werte der Eingabefelder aus diesem Zustand stammen und jede Änderung über `onChange` zurückgeschrieben wird, handelt es sich um kontrollierte Formularelemente. Zusätzliche Zustände steuern die Erfolgsmeldung und den Text des Speicherbuttons.

Beim Absenden werden die Eingaben in ein typisiertes `NewRide`-Objekt umgewandelt. Start- und Zielkoordinaten werden ermittelt und daraus eine ungefähre Entfernung, Dauer und ein Preis berechnet. Anschließend fügt `addRide` die neue Fahrt dem gemeinsamen Fahrtenzustand hinzu. Die Fahrt erscheint dadurch unmittelbar auf der Home-Seite und in der Fahrtensuche. Nach einer kurzen Erfolgsmeldung wird zur Home-Seite navigiert. Diese Abfolge bildet die zentrale durchgängige Nutzeraktion von M2: Formular ausfüllen, Fahrt veröffentlichen und das Ergebnis ohne Neuladen auf anderen Ansichten sehen.

Weitere lokale Zustände werden für die ausgewählte Fahrt, die Suchkriterien, die Chat-Eingabe und den Bearbeitungsmodus des Profils eingesetzt. In `find_ride.tsx` übergibt die `SearchBar` die eingegebenen Kriterien an die übergeordnete Seite. Dort werden die vorhandenen Fahrten nach Start, Ziel, Datum und Uhrzeit gefiltert. Das Anklicken einer `RideCard` setzt die ausgewählte Fahrt und aktualisiert gleichzeitig die Routendarstellung.

### Effekte und vorläufige Persistenz

`useEffect` wurde dort eingesetzt, wo eine Änderung des React-Zustands eine Nebenwirkung auslösen sollte. Die Context-Dateien speichern Fahrten, Benutzer und Chatnachrichten im `localStorage`, sobald sich die jeweiligen Daten verändern. Beim Start der Anwendung werden diese Werte wieder eingelesen. Dadurch blieben neu erstellte Fahrten, registrierte Nutzer, Profiländerungen und Nachrichten auch nach einem Neuladen des Browsers erhalten.

Diese Speicherung war eine Übergangslösung für M2 und nicht als sichere Produktivlösung gedacht. Insbesondere die lokale Benutzerverwaltung ersetzte noch keine echte Authentifizierung. Im folgenden Meilenstein wurden diese Aufgaben deshalb auf das Express-Backend und die Datenbank verlagert.

Zusätzlich wurden Effekte für die Kartenansicht verwendet. `RouteMap.tsx` reagiert auf Änderungen der eingegebenen Orte, fragt Koordinaten und Routendaten ab und aktualisiert anschließend Marker und Streckenlinie. Der eigene Hook `useDebounce` verzögert die Anfrage, damit nicht nach jedem einzelnen Tastendruck sofort ein neuer Request ausgelöst wird. Weitere Effekte passen den sichtbaren Kartenausschnitt an oder scrollen den Chat nach einer neuen Nachricht automatisch nach unten.

### Ergebnis und Weiterentwicklung bis zum finalen Projektstand

Mit M2 wurde aus dem statischen Prototyp eine bedienbare Single-Page-Anwendung. Die damals entwickelten TSX-Seiten, kontrollierten Formulare, Props und Hooks bilden auch im finalen Projekt weiterhin die Grundlage des Frontends. Die größten Änderungen betreffen deshalb weniger die sichtbare Bedienung als die Aufteilung des Codes und die Herkunft der Daten.

In M2 befanden sich die Routendefinitionen noch gemeinsam mit der Startseite in `src/StartPage.tsx`. Im finalen Stand enthält diese Datei nur noch die Login- und Registrierungsoberfläche. Die Navigation wurde nach `src/routes/AppRoutes.tsx` ausgelagert und dort um geschützte Routen, Weiterleitungen und eine 404-Seite ergänzt. Wiederkehrende Bereiche, die in M2 in mehreren Seiten einzeln definiert waren, wurden außerdem in `src/components/Header.tsx` und `src/components/Footer.tsx` zusammengefasst. Fachliche Komponenten wie `RideCard`, `ContactItem`, `MessageRow`, `ChatInput`, `ProfileField` und `ProfileInput` blieben dagegen in ihrer grundsätzlichen Funktion erhalten.

Deutlich verändert wurden die Context-Dateien. In M2 speicherten `UserContext`, `RideContext` und `ChatContext` ihre Daten überwiegend im `localStorage`. Im finalen Projekt verwalten sie weiterhin den gemeinsamen React-State, greifen für Benutzer, Fahrten und Chats jedoch über `authApi.ts`, `rideApi.ts` und `chatApi.ts` auf das Express-Backend und die SQLite-Datenbank zu. Der `UserContext` verwaltet zusätzlich das JWT; lokal gespeichert bleiben nur clientseitige Werte wie das Token, der ausgewählte Chatkontakt und der Darkmode.

Die TypeScript-Modelle wurden entsprechend erweitert: Fahrten besitzen nun eine `driverId`, Chatnachrichten eine `senderId`, und Benutzerprofile enthalten unter anderem ein Profilbild und einen numerischen Kilometerpreis. Damit konnte die in M2 entwickelte Interaktionsstruktur weiterverwendet werden, obwohl die Daten im finalen Stand nicht mehr nur im Browser, sondern persistent im Backend gespeichert werden.

---

## Meilenstein 3 – Daten, Routing, REST, Qualität und Backend

Im dritten Meilenstein wurde die bis dahin ausschließlich im Browser laufende React-Anwendung zu einer Full-Stack-Anwendung erweitert. Der Schwerpunkt lag auf einer klaren URL-Struktur mit React Router, der Kommunikation mit einem eigenen REST-Backend, einer persistenten Datenhaltung sowie einer echten Registrierung und Anmeldung. Zusätzlich wurden sichtbare Lade- und Fehlerzustände sowie automatisierte Tests ergänzt. Der damalige Stand ist im Git-Tag **Meilenstein_3** dokumentiert.

### Routing und geschützte Seiten

Die Navigation wurde mit React Router zentral organisiert. In `src/main.tsx` wird die Anwendung innerhalb eines `BrowserRouter` gerendert. Die eigentlichen Routendefinitionen befinden sich in `src/routes/AppRoutes.tsx`. Dort werden unter anderem die Pfade `/`, `/home`, `/chat`, `/create-ride`, `/find-ride`, `/profile` und `/impressum` den jeweiligen React-Seiten zugeordnet. Für unbekannte URLs existiert außerdem eine eigene 404-Seite. Zusätzliche Weiterleitungen von älteren Pfaden wie `/create_ride` und `/find_ride` verhindern, dass bereits verwendete Links ungültig werden.

Die Navigation erfolgt innerhalb der Anwendung über `Link`, `Navigate` und `useNavigate`. Dadurch wird beim Wechsel zwischen den Ansichten nicht das gesamte HTML-Dokument neu geladen. Nach einer erfolgreichen Anmeldung oder Registrierung navigiert die Startseite beispielsweise direkt zur Home-Seite.

Die Seiten mit nutzerspezifischen Inhalten wurden durch die Komponente `ProtectedRoute` geschützt. Sie prüft über den `UserContext`, ob ein Benutzer angemeldet ist. Solange ein vorhandenes Token überprüft wird, erscheint der sichtbare Ladehinweis „Authentifizierung wird geprüft...“. Ist keine gültige Anmeldung vorhanden, leitet `Navigate` zurück zur Startseite. Auf diese Weise sind die Routen für Home, Chat, Fahrt anbieten, Fahrt finden und Profil nicht ohne Anmeldung erreichbar.

### Eigenes Express-Backend und REST-Schnittstelle

Für M3 wurde im Ordner `react-app/server` ein eigenes Node.js-Backend mit Express eingerichtet. `src/index.ts` startet den Server auf Port 3001, während `src/app.ts` die Express-Anwendung und ihre Endpunkte enthält. Die Middleware `express.json()` verarbeitet JSON-Anfragen. CORS erlaubt dem auf Port 5173 laufenden Vite-Frontend, Anfragen an das Backend zu senden.

Die Kommunikation zwischen Frontend und Backend wurde in `src/api/authApi.ts` gekapselt. Die Funktionen `registerUserRequest`, `loginUserRequest` und `getCurrentUserRequest` verwenden `fetch` gegen die Basisadresse `http://localhost:3001/api`. Registrierung und Login senden JSON-Daten mit `POST`, während der aktuell angemeldete Benutzer über einen `GET`-Request geladen wird.

Im M3-Stand standen folgende zentrale Endpunkte zur Verfügung:

| Methode | Endpunkt | Aufgabe |
|---|---|---|
| `GET` | `/api/health` | Prüft, ob das Backend erreichbar ist |
| `GET` | `/api/db-status` | Prüft die Datenbankverbindung und liefert die Benutzeranzahl |
| `POST` | `/api/auth/register` | Registriert einen Benutzer |
| `POST` | `/api/auth/login` | Meldet einen Benutzer an |
| `GET` | `/api/auth/me` | Liefert den Benutzer zum übergebenen JWT |

Damit waren sowohl lesende als auch schreibende REST-Anfragen umgesetzt. Die API antwortet mit passenden HTTP-Statuscodes. Fehlende Eingaben führen beispielsweise zu `400 Bad Request`, doppelte E-Mail-Adressen oder Benutzernamen zu `409 Conflict` und fehlerhafte Anmeldedaten zu `401 Unauthorized`.

### Datenbankzugriff mit Prisma und SQLite

Die persistente Datenhaltung wurde mit SQLite und Prisma umgesetzt. Das Prisma-Schema unter `server/prisma/schema.prisma` enthielt in M3 zunächst das Modell `User`. Gespeichert wurden eine eindeutige E-Mail-Adresse und ein eindeutiger Benutzername, der Passwort-Hash, Vor- und Nachname, Geburtsdatum, Studiengang sowie Zeitstempel für Erstellung und Änderung.

Beim Registrieren prüft das Backend zunächst die Pflichtfelder und normalisiert E-Mail-Adresse und Benutzername. Anschließend wird mit Prisma kontrolliert, ob bereits ein Benutzer mit denselben Zugangsdaten existiert. Ist dies nicht der Fall, wird der neue Datensatz mit `prisma.user.create()` in SQLite gespeichert. Die Datenbank wird über eine Prisma-Migration erzeugt und nicht durch eine statische JSON-Datei simuliert.

Persistiert wurden zu diesem Zeitpunkt vor allem die Benutzerkonten. Fahrten und Chatnachrichten wurden im M3-Tag weiterhin über ihre React-Contexts im `localStorage` des Browsers gespeichert. Diese Aufteilung war ausreichend, um die Datenbankanbindung und echte Accounts umzusetzen, wurde für die finale Version jedoch noch erweitert.

### Authentifizierung mit bcrypt und JWT

Passwörter werden nicht im Klartext gespeichert. Bei der Registrierung erzeugt `bcrypt.hash()` mit einem Kostenfaktor von 10 einen Passwort-Hash. Beim Login wird das eingegebene Passwort mit `bcrypt.compare()` gegen diesen Hash geprüft. Die API gibt in ihren Benutzerobjekten nur öffentliche Profildaten zurück; der Passwort-Hash wird nicht an das Frontend übertragen.

Nach einer erfolgreichen Registrierung oder Anmeldung erzeugt das Backend mit `jsonwebtoken` ein JWT mit einer Gültigkeit von zwei Stunden. Das Token enthält die Benutzer-ID und die E-Mail-Adresse. Im Frontend verwaltet der `UserContext` das Token und den aktuell angemeldeten Benutzer. Das Token wird im `localStorage` abgelegt, damit die Anmeldung nach einem Neuladen wiederhergestellt werden kann.

Für geschützte Anfragen wird das JWT im Header als `Authorization: Bearer <Token>` übertragen. Die Middleware `authenticateToken` kontrolliert, ob der Header vorhanden und korrekt formatiert ist und ob das Token gültig ist. Erst danach wird der geschützte Endpunkt `/api/auth/me` ausgeführt. Beim Start der Anwendung ruft der `UserContext` diesen Endpunkt auf. Ist das gespeicherte Token ungültig oder abgelaufen, werden Token und Benutzerzustand entfernt.

### Geteilter Zustand sowie Lade- und Fehlerbehandlung

Die bereits in M2 eingeführten Contexts wurden für M3 weiterverwendet. `AppProviders.tsx` stellt unter anderem den `UserContext`, `RideContext` und `ChatContext` für die gesamte Anwendung bereit. Besonders der `UserContext` übernimmt nun nicht mehr nur eine lokale Benutzerverwaltung, sondern verbindet die React-Oberfläche mit der Authentifizierungs-API.

Registrierung und Anmeldung liefern ein typisiertes `AuthResult` zurück. Dadurch kann die Startseite Fehler direkt beim jeweiligen Formular anzeigen. Fehlermeldungen aus dem Backend werden in `authApi.ts` aus der JSON-Antwort gelesen und als JavaScript-Fehler weitergegeben. Auch Netzwerkfehler oder nicht erfolgreiche HTTP-Antworten führen somit nicht zu einem stillen Scheitern. Parallel verhindert der Zustand `isAuthLoading`, dass eine geschützte Seite angezeigt oder vorschnell umgeleitet wird, während das gespeicherte Token noch überprüft wird.

### Automatisierte API-Tests

Die zentralen Backend-Funktionen wurden mit Vitest und Supertest getestet. Supertest kann Requests direkt gegen die exportierte Express-Anwendung ausführen, ohne dass dafür manuell ein Serverprozess gestartet werden muss. Im M3-Stand bestanden vier API-Tests.

Ein Test prüft den Health-Endpunkt. Ein weiterer stellt sicher, dass `/api/auth/me` ohne JWT mit Status 401 abgewiesen wird. Der umfangreichste Test registriert einen neuen Benutzer, meldet ihn anschließend an und ruft mit dem erhaltenen Token den geschützten Benutzerendpunkt auf. Dabei wird auch geprüft, dass keine Passwortdaten in der Antwort enthalten sind. Der vierte Test kontrolliert, dass ein falsches Passwort abgelehnt wird. Eindeutige E-Mail-Adressen und Benutzernamen werden mit einem Zeitstempel erzeugt, damit sich wiederholte Testläufe nicht gegenseitig blockieren.

### Architekturentscheidung

Die in der README dokumentierte Architektur bestand aus drei Ebenen: der React-SPA im Browser, dem Express-Backend als HTTP-API und der über Prisma angebundenen SQLite-Datenbank. Diese Trennung verhindert, dass das Frontend direkt auf die Datenbank zugreift. Stattdessen laufen Validierung, Passwort-Hashing, Token-Erzeugung und Datenbankoperationen kontrolliert im Backend.

Server-Side Rendering oder Static Site Generation waren für CampusRide nicht erforderlich. Die Anwendung besteht hauptsächlich aus Login, Formularen, Kartenansichten und nutzerspezifischen Daten. Sie ist daher stark interaktiv und nicht primär auf öffentlich indexierbare Inhaltsseiten oder Suchmaschinenoptimierung ausgerichtet.

### Weiterentwicklung bis zum finalen Projektstand

Die in M3 eingeführte Grundarchitektur wurde im finalen Projekt beibehalten. React Router, `ProtectedRoute`, der `UserContext`, das Express-Backend, Prisma, SQLite, bcrypt und JWT arbeiten weiterhin nach demselben Prinzip. Die wesentliche Weiterentwicklung bestand darin, die Persistenz auf die übrigen Kernfunktionen auszudehnen.

Das Prisma-Schema enthält im finalen Stand zusätzlich die Modelle `Ride`, `ChatContact` und `ChatMessage` sowie Relationen zu den Benutzern. Fahrten werden über eigene GET-, POST-, PUT- und DELETE-Endpunkte verwaltet. Auch Chatkontakte und Nachrichten werden über geschützte API-Endpunkte geladen, erstellt und gelöscht. Entsprechend greifen `ridecontext.tsx` und `chatcontext.tsx` nicht mehr hauptsächlich auf den `localStorage`, sondern über `rideApi.ts` und `chatApi.ts` auf das Backend zu.

Das Benutzerprofil wurde um Stadt, Kilometerpreis und Profilbild erweitert und kann über `PUT /api/auth/me` persistent geändert werden. Zusätzlich prüft die finale Registrierung mithilfe von `academic-email-verifier`, ob eine akademische E-Mail-Adresse verwendet wird. Die Tests wurden auf Registrierungsvalidierung, Profilbilder, Fahrten, Berechtigungsprüfungen, Chats und Datenbankstatus ausgeweitet. M3 bildete damit das technische Fundament; die finale Version übertrug dieselbe REST- und Datenbankarchitektur auf sämtliche wesentlichen Anwendungsdaten.

---

## Meilenstein 4 – Betrieb, Fertigstellung und Abschluss

Der vierte Meilenstein hatte das Ziel, den in M3 aufgebauten Full-Stack-Prototypen zu einer reproduzierbar startbaren und durchgängig nutzbaren Anwendung fertigzustellen. Im Mittelpunkt standen deshalb nicht mehr einzelne neue Vorlesungskonzepte, sondern der zuverlässige Betrieb der Gesamtanwendung, die Vervollständigung der persistenten Kernfunktionen, eine konkrete Performance-Maßnahme sowie die abschließende Dokumentation und Demonstration des Projekts.

### Vervollständigung der Full-Stack-Anwendung

Im M3-Stand waren bereits das Express-Backend, die SQLite-Datenbank und die Authentifizierung vorhanden. Persistiert wurden zu diesem Zeitpunkt jedoch hauptsächlich die Benutzerkonten. Für den finalen Stand wurde das Prisma-Datenmodell in `react-app/server/prisma/schema.prisma` deshalb um die Modelle `Ride`, `ChatContact` und `ChatMessage` erweitert. Zusätzlich erhielt das Modell `User` die Profilfelder `city`, `pricePerKm` und `avatarUrl`.

Damit werden nun nicht nur Benutzer, sondern auch angebotene Fahrten, Chatkontakte, Nachrichten und Profiländerungen dauerhaft in SQLite gespeichert. Die zuvor teilweise auf `localStorage` basierenden Contexts wurden auf API-Zugriffe umgestellt. `ridecontext.tsx` verwendet die Funktionen aus `src/api/rideApi.ts`, während `chatcontext.tsx` über `src/api/chatApi.ts` auf das Backend zugreift. Der lokale React-State dient damit vor allem zur Darstellung und Aktualisierung der Oberfläche; die dauerhafte Datenquelle ist die Datenbank.

Das Backend stellt für Fahrten Endpunkte zum Laden, Erstellen, Ändern und Löschen bereit. Änderungen und Löschungen sind nur für den jeweiligen Fahrer erlaubt. Für den Chat existieren Endpunkte zum Laden und Anlegen von Kontakten, zum Senden von Nachrichten sowie zum Leeren oder Entfernen eines Chats. Beim Klick auf das Profilbild eines Fahrers kann ein passender Chatkontakt erzeugt werden. Dadurch sind die zentralen Nutzungsschritte – Registrierung, Login, Fahrt anbieten, Fahrt finden und Kontaktaufnahme – im finalen Stand durchgängig miteinander verbunden.

Auch die Registrierung wurde weiter abgesichert. Mithilfe von `academic-email-verifier` prüft das Backend, ob eine akademische E-Mail-Adresse verwendet wird. Neue Benutzer erhalten außerdem eines der vorhandenen Standard-Profilbilder, falls kein eigenes Bild gewählt wurde. Profilangaben wie Name, Studiengang, Wohnort, Kilometerpreis und Profilbild können über den geschützten Endpunkt `PUT /api/auth/me` persistent geändert werden.

### Reproduzierbarer Betrieb mit Docker Compose

Die wichtigste betriebliche Erweiterung von M4 ist die Containerisierung der Anwendung. Im Projekt-Root befindet sich die Datei `docker-compose.yml`, die Frontend und Backend gemeinsam startet. Dadurch ist keine getrennte manuelle Installation und Konfiguration beider Anwendungsteile erforderlich.

Docker Compose definiert zwei Services:

| Service | Aufgabe | Port |
|---|---|---|
| `client` | React-Frontend mit Vite | `5173` |
| `server` | Express-Backend, Prisma und SQLite | `3001` |

SQLite benötigt keinen eigenen Datenbankserver und daher auch keinen separaten Datenbank-Container. Die Datenbankdatei befindet sich im Backend-Container unter `/app/data/dev.db`. Das benannte Docker-Volume `db-data` wird an dieses Verzeichnis gebunden. Dadurch bleiben Benutzer, Fahrten und Chats auch dann erhalten, wenn die Container beendet oder neu erstellt werden. Erst ein bewusstes Entfernen des Volumes würde die persistierten Daten löschen.

Für beide Services existiert ein eigenes Dockerfile. Das Frontend-Dockerfile verwendet ein Node-20-Image, installiert die npm-Abhängigkeiten und startet Vite mit dem Parameter `--host`, damit der Entwicklungsserver außerhalb des Containers über Port 5173 erreichbar ist. Das Backend-Dockerfile installiert zusätzlich die für den SQLite-Adapter benötigten Build-Werkzeuge, erzeugt den Prisma Client und kompiliert den TypeScript-Code.

Beim Start des Backend-Containers wird zunächst

```bash
npx prisma migrate deploy
```

ausgeführt. Dadurch werden alle vorhandenen Migrationen automatisch auf die Datenbank im Docker-Volume angewendet. Anschließend startet der kompilierte Express-Server. Der Startvorgang ruft außerdem die Funktion `seed()` aus `server/src/seed.ts` auf. Diese legt mehrere Testbenutzer und eine Beispielfahrt an, sofern die entsprechenden Datensätze noch nicht existieren. Die Seed-Funktion ist damit wiederholbar, ohne bei jedem Start Duplikate zu erzeugen.

Die gesamte Anwendung kann aus dem Projekt-Root mit folgendem Befehl gebaut und gestartet werden:

```bash
docker compose up --build
```

Danach ist das Frontend unter `http://localhost:5173` und das Backend unter `http://localhost:3001` erreichbar. Um den Build-Kontext klein zu halten, schließen `.dockerignore`-Dateien unter anderem `node_modules`, lokale Umgebungsdateien, Build-Ausgaben und die lokale Entwicklungsdatenbank aus.

### Performance- und HTTP-Aspekt

Als konkrete Performance-Maßnahme wird die Anzahl externer HTTP-Anfragen bei der Routendarstellung begrenzt. Während ein Benutzer Start- und Zieladresse eingibt, ändern sich die Eingabewerte mit nahezu jedem Tastendruck. Ohne Begrenzung würde jede dieser Änderungen unmittelbar neue Anfragen an den Geocoding-Dienst von OpenStreetMap und anschließend an den Routing-Dienst OSRM auslösen.

Der Hook `useDebounce` verzögert die Verarbeitung der Adressen deshalb um 800 Millisekunden. Nur wenn innerhalb dieses Zeitraums keine weitere Eingabe erfolgt, werden die Adressen geocodiert und die Route neu geladen. Dadurch werden unnötige Netzwerkanfragen vermieden, externe Dienste weniger belastet und die Benutzeroberfläche muss seltener auf Zwischenergebnisse reagieren.

Ergänzend werden in mehreren Komponenten abgeleitete Daten mit `useMemo` berechnet. Dies betrifft beispielsweise die gefilterte Fahrtenliste und die zum ausgewählten Chatkontakt gehörenden Nachrichten. Die Berechnung wird dadurch nur erneut ausgeführt, wenn sich die jeweils relevanten Eingangsdaten ändern. Als M4-Performance-Aspekt steht jedoch vor allem das Debouncing im Vordergrund, da es unmittelbar die Anzahl der HTTP-Anfragen reduziert.

### Testdaten und Qualitätssicherung

Für die finale Version wurden auch die automatisierten Backend-Tests deutlich erweitert. Die Testdatei `server/src/app.test.ts` enthält 17 Tests. Neben der Registrierung werden nun insbesondere die CRUD-Operationen für Fahrten, die Berechtigungsprüfung beim Bearbeiten fremder Fahrten, die Chat-Endpunkte, fehlende Authentifizierung und der Datenbankstatus geprüft.

Ein umfangreicher Integrationstest bildet beispielsweise den Ablauf ab, bei dem ein Mitfahrer auf das Fahrerprofil einer Fahrt klickt, ein Chatkontakt entsteht und anschließend Nachrichten ausgetauscht werden können. Die Tests prüfen damit nicht nur isolierte Endpunkte, sondern auch zentrale Abläufe der fertigen Anwendung.

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

OpenStreetMap wird aktuell nicht zur auswahl von Start- und Endpunkt verwendet wäre eine mögliche verbesserung

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
