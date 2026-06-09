import React from "react";

function App() {
    return (
        <div>
            <header>
            <h1>Willkommen auf der Startseite</h1>
                <nav>
                    <input type="checkbox" id="login-toggle" />
                    <label for="login-toggle" class="open-btn">Einloggen</label>

                    <input type="checkbox" id="register-toggle" />
                    <label for="register-toggle" class="open-btn">Registrieren</label>

                    <div class="login-overlay">
                        <div class="login-popup">
                            <label for="login-toggle" class="close-btn">&times;</label>
                            <section>
                                <h2 class="logintext">Bitte Benutzerdaten eingeben</h2>
                                <p class="logintext">
                                    Melde dich an, um Fahrten am Campus zu finden oder anzubieten.
                                </p>

                                <form action="src/pages/home/home.html">
                                    <div class="form-group">
                                        <label for="user-id" class="logintext"
                                        >Benutzername oder E-Mail:</label
                                        >
                                        <input
                                            type="text"
                                            id="user-id"
                                            name="username"
                                            placeholder="z.B. Alex_Muster"
                                            required
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label for="pass-id" class="logintext">Passwort:</label>
                                        <input
                                            type="password"
                                            id="pass-id"
                                            name="password"
                                            required
                                        />
                                    </div>

                                    <button type="submit">Anmelden</button>
                                </form>
                            </section>
                        </div>
                    </div>

                    <div class="register-overlay">
                        <div class="login-popup">
                            <label for="register-toggle" class="close-btn">&times;</label>
                            <section>
                                <h2 class="logintext">Bitte Benutzerdaten eingeben</h2>
                                <p class="logintext">
                                    Registriere dich, um Fahrten am Campus zu finden oder
                                    anzubieten.
                                </p>

                                <form action="html/home/home.html">
                                    <div class="form-group">
                                        <label for="user-id-register" class="logintext"
                                        >E-Mail:</label
                                        >
                                        <input
                                            type="text"
                                            id="user-id-register"
                                            name="username"
                                            placeholder="z.B. Alex_Muster"
                                            required
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label for="pass-id-register" class="logintext"
                                        >Passwort:</label
                                        >
                                        <input
                                            type="password"
                                            id="pass-id-register"
                                            name="password"
                                            placeholder="z.B. 12345"
                                            required
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="username" class="logintext">Benutzername:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="vorname"
                                            placeholder="z.B. Alex"
                                            required
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="vorname" class="logintext">Vorname:</label>
                                        <input
                                            type="text"
                                            id="vorname"
                                            name="vorname"
                                            placeholder="z.B. Alex"
                                            required
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label for="nachname" class="logintext">Nachname:</label>
                                        <input
                                            type="text"
                                            id="nachname"
                                            name="nachname"
                                            placeholder="z.B. Muster"
                                            required
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="studiengang" class="logintext"
                                        >Studiengang:</label
                                        >
                                        <input
                                            type="text"
                                            id="studiengang"
                                            name="studiengang"
                                            placeholder="z.B. AIN"
                                            required
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="geburtstag" class="logintext">Geburtstag:</label>
                                        <input
                                            type="date"
                                            id="geburtstag"
                                            name="geburtstag"
                                            required
                                        />
                                    </div>

                                    <button type="submit">Anmelden und Account erstellen</button>
                                </form>
                            </section>
                        </div>
                    </div>
                </nav>
            </header>
        <main>
            <article>Bitte melden sie sich an um Inhalte zu sehen</article>
        </main>
        <footer>
            <a href="src/pages/impressum/impressum.html" class="extra-info-btn">Impressum</a> |
            <a href="#" class="extra-info-btn">Copyright</a> |
            <a href="#" class="extra-info-btn">Kontakt</a>
         </footer>
        </div>);
}

export default App;