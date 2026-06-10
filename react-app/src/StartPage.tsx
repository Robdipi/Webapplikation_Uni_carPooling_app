import React, { useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ImpressumPage from "./pages/impressum/impressum";
import HomePage from "./pages/home/home";
import ChatPage from "./pages/chat/chat";
import CreateRidePage from "./pages/create_ride/create_ride";
import FindRidePage from "./pages/find_ride/find_ride";
import ProfilePage from "./pages/profile/profile";
import { useUserContext } from "./contexts/usercontext";

function StartPage() {
    const navigate = useNavigate();
    const { loginUser, registerUser } = useUserContext();
    const [loginError, setLoginError] = useState<string>("");
    const [registerError, setRegisterError] = useState<string>("");

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const result = loginUser({
            identifier: String(formData.get("identifier") ?? ""),
            password: String(formData.get("password") ?? ""),
        });

        if (!result.success) {
            setLoginError(result.error ?? "Anmeldung fehlgeschlagen.");
            return;
        }

        setLoginError("");
        navigate("/home");
    };

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const result = registerUser({
            email: String(formData.get("email") ?? ""),
            username: String(formData.get("username") ?? ""),
            password: String(formData.get("password") ?? ""),
            firstName: String(formData.get("firstName") ?? ""),
            lastName: String(formData.get("lastName") ?? ""),
            birthDate: String(formData.get("birthDate") ?? ""),
            course: String(formData.get("course") ?? ""),
        });

        if (!result.success) {
            setRegisterError(result.error ?? "Registrierung fehlgeschlagen.");
            return;
        }

        setRegisterError("");
        navigate("/home");
    };

    return (
        <div>
            <header>
                <h1>Willkommen auf der Startseite</h1>
                <nav>
                    <input type="checkbox" id="login-toggle" />
                    <label htmlFor="login-toggle" className="open-btn">
                        Einloggen
                    </label>

                    <input type="checkbox" id="register-toggle" />
                    <label htmlFor="register-toggle" className="open-btn">
                        Registrieren
                    </label>

                    <div className="login-overlay">
                        <div className="login-popup">
                            <label htmlFor="login-toggle" className="close-btn">
                                &times;
                            </label>
                            <section>
                                <h2 className="logintext">Bitte Benutzerdaten eingeben</h2>
                                <p className="logintext">
                                    Melde dich an, um Fahrten am Campus zu finden oder anzubieten.
                                </p>

                                <form onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <label htmlFor="user-id" className="logintext">
                                            Benutzername oder E-Mail:
                                        </label>
                                        <input
                                            type="text"
                                            id="user-id"
                                            name="identifier"
                                            placeholder="z.B. Alex_Muster oder alex@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="pass-id" className="logintext">
                                            Passwort:
                                        </label>
                                        <input
                                            type="password"
                                            id="pass-id"
                                            name="password"
                                            required
                                        />
                                    </div>

                                    {loginError !== "" && (
                                        <p className="logintext">{loginError}</p>
                                    )}

                                    <button type="submit">Anmelden</button>
                                </form>
                            </section>
                        </div>
                    </div>

                    <div className="register-overlay">
                        <div className="login-popup">
                            <label htmlFor="register-toggle" className="close-btn">
                                &times;
                            </label>
                            <section>
                                <h2 className="logintext">Bitte Benutzerdaten eingeben</h2>
                                <p className="logintext">
                                    Registriere dich, um Fahrten am Campus zu finden oder anzubieten.
                                </p>

                                <form onSubmit={handleRegister}>
                                    <div className="form-group">
                                        <label htmlFor="user-id-register" className="logintext">
                                            E-Mail:
                                        </label>
                                        <input
                                            type="email"
                                            id="user-id-register"
                                            name="email"
                                            placeholder="z.B. alex@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="pass-id-register" className="logintext">
                                            Passwort:
                                        </label>
                                        <input
                                            type="password"
                                            id="pass-id-register"
                                            name="password"
                                            placeholder="z.B. 12345"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="username" className="logintext">
                                            Benutzername:
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="z.B. Alex_Muster"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="vorname" className="logintext">
                                            Vorname:
                                        </label>
                                        <input
                                            type="text"
                                            id="vorname"
                                            name="firstName"
                                            placeholder="z.B. Alex"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nachname" className="logintext">
                                            Nachname:
                                        </label>
                                        <input
                                            type="text"
                                            id="nachname"
                                            name="lastName"
                                            placeholder="z.B. Muster"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="studiengang" className="logintext">
                                            Studiengang:
                                        </label>
                                        <input
                                            type="text"
                                            id="studiengang"
                                            name="course"
                                            placeholder="z.B. AIN"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="geburtstag" className="logintext">
                                            Geburtstag:
                                        </label>
                                        <input
                                            type="date"
                                            id="geburtstag"
                                            name="birthDate"
                                            required
                                        />
                                    </div>

                                    {registerError !== "" && (
                                        <p className="logintext">{registerError}</p>
                                    )}

                                    <button type="submit">
                                        Anmelden und Account erstellen
                                    </button>
                                </form>
                            </section>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <article>Bitte melden Sie sich an, um Inhalte zu sehen.</article>
            </main>

            <footer>
                <Link to="/impressum" className="extra-info-btn">
                    Impressum
                </Link>{" "}
                | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
                <a href="#" className="extra-info-btn">Kontakt</a>
            </footer>
        </div>
    );
}

const HomePageRouts: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/create-ride" element={<CreateRidePage />} />
            <Route path="/create_ride" element={<Navigate to="/create-ride" replace />} />
            <Route path="/find-ride" element={<FindRidePage />} />
            <Route path="/find_ride" element={<Navigate to="/find-ride" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
};

export default HomePageRouts;
