import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import "./create_ride.css";

// Types
interface RideForm {
    departure: string;
    destination: string;
    dateTime: string;
    seats: number;
    extra: string;
}

// Header
const Header: React.FC = () => (
    <header>
        <div className="logo">CampusRide</div>
        <nav>
            <Link to="/home" className="open-btn">Home</Link>
            <Link to="/chat" className="open-btn">Chat</Link>
            <Link to="/create-ride" className="open-btn">Fahrt anbieten</Link>
            <Link to="/find-ride" className="open-btn">Fahrt finden</Link>
            <Link to="/profile" className="open-btn">Profil</Link>
            <Link to="/" className="open-btn">Abmelden</Link>
        </nav>
    </header>
);

// Info box
const InfoBox: React.FC = () => (
    <aside className="info-box">
        <h3>Tipps für Fahrer</h3>
        <ul>
            <li>Spritkosten fair teilen</li>
            <li>Pünktlich am Treffpunkt sein</li>
            <li>Musikgeschmack absprechen</li>
        </ul>
    </aside>
);

const Footer: React.FC = () => (
    <footer>
        <Link to="/impressum" className="extra-info-btn">Impressum</Link>{" "}
        | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

// Main component
const CreateRidePage: React.FC = () => {
    const [form, setForm] = useState<RideForm>({
        departure: "",
        destination: "",
        dateTime: "",
        seats: 1,
        extra: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "seats" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Ride created:", form);

        // Later: API call here
        // fetch("/api/rides", { method: "POST", body: JSON.stringify(form) })
    };

    return (
        <div>
            <Header />

            <main>
                <div className="content-wrapper">
                    <section>
                        <h2>Fahrt anbieten</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="departure">Startadresse</label>
                                <input
                                    type="text"
                                    id="departure"
                                    name="departure"
                                    placeholder="z.B. Konstanz HTWG"
                                    value={form.departure}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="destination">Zieladresse</label>
                                <input
                                    type="text"
                                    id="destination"
                                    name="destination"
                                    placeholder="z.B. Seezeit Wohnheim"
                                    value={form.destination}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateTime">Uhrzeit und Datum</label>
                                <input
                                    type="datetime-local"
                                    id="dateTime"
                                    name="dateTime"
                                    value={form.dateTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="seats">Anzahl Sitze</label>
                                <input
                                    type="number"
                                    id="seats"
                                    name="seats"
                                    min={1}
                                    max={8}
                                    value={form.seats}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="extra">Zusatzinformation</label>
                                <textarea
                                    id="extra"
                                    name="extra"
                                    rows={4}
                                    placeholder="Platz für Gepäck, Musikwünsche, etc."
                                    value={form.extra}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="create-ride-submit-button">
                                Fahrt veröffentlichen
                            </button>
                        </form>
                    </section>

                    <InfoBox />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CreateRidePage;