import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import ImpressumPage from "./pages/impressum/impressum";
import HomePage from "./pages/home/home";
import ChatPage from "./pages/chat/chat";
import CreateRidePage from "./pages/create_ride/create_ride";
import FindRidePage from "./pages/find_ride/file_ride";
import ProfilePage from "./pages/profile/profile";
import { useNavigate } from "react-router-dom";


/*
    All the routes are here because our Project is pretty small
    you can go to them like :
    <Link to="/impressum" className="extra-info-btn">Impressum</Link>
    and then the ide says you should import something(at least mine does) do that
    don'T use the old syntax, Chat gpt said its bad but it still works


 */
const HomePageRouts: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/create-ride" element={<CreateRidePage />} />
            <Route path="/find-ride" element={<FindRidePage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
};



function StartPage() {
    function StartPage() {
    const navigate = useNavigate();

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/home");
    };

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/home");
    };

    return (
        <div>
            <header>
            <h1>Willkommen auf der Startseite</h1>
                <nav>
                    <input type="checkbox" id="login-toggle" />
                    <label for="login-toggle" className="open-btn">Einloggen</label>

                    <input type="checkbox" id="register-toggle" />
                    <label for="register-toggle" className="open-btn">Registrieren</label>

                    <div className="login-overlay">
                        <div className="login-popup">
                            <label for="login-toggle" className="close-btn">&times;</label>
                            <section>
                                <h2 className="logintext">Bitte Benutzerdaten eingeben</h2>
                                <p className="logintext">
                                    Melde dich an, um Fahrten am Campus zu finden oder anzubieten.
                                </p>

                                <form onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <label for="user-id" className="logintext"
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

                                    <div className="form-group">
                                        <label for="pass-id" className="logintext">Passwort:</label>
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

                    <div className="register-overlay">
                        <div className="login-popup">
                            <label for="register-toggle" className="close-btn">&times;</label>
                            <section>
                                <h2 className="logintext">Bitte Benutzerdaten eingeben</h2>
                                <p className="logintext">
                                    Registriere dich, um Fahrten am Campus zu finden oder
                                    anzubieten.
                                </p>

                                <form onSubmit={handleRegister}>
                                    <div className="form-group">
                                        <label for="user-id-register" className="logintext"
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

                                    <div className="form-group">
                                        <label for="pass-id-register" className="logintext"
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
                                    <div className="form-group">
                                        <label for="username" className="logintext">Benutzername:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="vorname"
                                            placeholder="z.B. Alex"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="vorname" className="logintext">Vorname:</label>
                                        <input
                                            type="text"
                                            id="vorname"
                                            name="vorname"
                                            placeholder="z.B. Alex"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label for="nachname" className="logintext">Nachname:</label>
                                        <input
                                            type="text"
                                            id="nachname"
                                            name="nachname"
                                            placeholder="z.B. Muster"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label for="studiengang" className="logintext"
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
                                    <div className="form-group">
                                        <label for="geburtstag" className="logintext">Geburtstag:</label>
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
            <Link to="/impressum" className="extra-info-btn">Impressum</Link>|
            <a href="#" className="extra-info-btn">Copyright</a> |
            <a href="#" className="extra-info-btn">Kontakt</a>
         </footer>
        </div>);
}

export default HomePageRouts;