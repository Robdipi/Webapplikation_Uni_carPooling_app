import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";
import {
    type Coordinates,
    type NewRide,
    useRideContext,
} from "../../contexts/ridecontext";
import RouteMap from "./RouteMap";
import "../style.css";
import "./create_ride.css";

interface RideForm {
    departure: string;
    destination: string;
    dateTime: string;
    seats: number;
    extra: string;
}

const defaultStartCoords: Coordinates = { lat: 47.6672, lng: 9.1716 };
const defaultDestinationCoords: Coordinates = { lat: 47.6897, lng: 9.1881 };

const knownPlaces: Record<string, Coordinates> = {
    "htwg": { lat: 47.6672, lng: 9.1716 },
    "htwg konstanz": { lat: 47.6672, lng: 9.1716 },
    "konstanz": { lat: 47.6595, lng: 9.1750 },
    "konstanz bahnhof": { lat: 47.6595, lng: 9.1750 },
    "universität konstanz": { lat: 47.6897, lng: 9.1881 },
    "uni konstanz": { lat: 47.6897, lng: 9.1881 },
    "radolfzell": { lat: 47.7389, lng: 8.9706 },
    "radolfzell bahnhof": { lat: 47.7389, lng: 8.9706 },
};

const Header: React.FC = () => {
    const { currentUser, logoutUser } = useUserContext();

    return (
        <header>
            <div className="logo">CampusRide</div>
            <nav>
                <Link to="/home" className="open-btn">Home</Link>
                <Link to="/chat" className="open-btn">Chat</Link>
                <Link to="/create-ride" className="open-btn">Fahrt anbieten</Link>
                <Link to="/find-ride" className="open-btn">Fahrt finden</Link>
                <Link to="/profile" className="open-btn">Profil</Link>
                <Link to="/" className="open-btn" onClick={logoutUser}>Abmelden</Link>
                {currentUser !== null && (
                    <span className="open-btn">Hallo {currentUser.profile.firstName}</span>
                )}
            </nav>
        </header>
    );
};

const Footer: React.FC = () => (
    <footer>
        <Link to="/impressum" className="extra-info-btn">Impressum</Link>{" "}
        | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

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

function normalizePlaceName(value: string): string {
    return value.trim().toLowerCase();
}

async function geocodeAddress(address: string): Promise<Coordinates | null> {
    const knownPlace = knownPlaces[normalizePlaceName(address)];

    if (knownPlace !== undefined) {
        return knownPlace;
    }

    if (address.trim() === "") {
        return null;
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
        );

        const data = (await response.json()) as Array<{
            lat: string;
            lon: string;
        }>;

        if (data.length === 0) {
            return null;
        }

        return {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
        };
    } catch {
        return null;
    }
}

function calculateDistanceKm(start: Coordinates, end: Coordinates): number {
    const earthRadiusKm = 6371;
    const latDistance = ((end.lat - start.lat) * Math.PI) / 180;
    const lngDistance = ((end.lng - start.lng) * Math.PI) / 180;
    const startLat = (start.lat * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;

    const a =
        Math.sin(latDistance / 2) ** 2 +
        Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDistance / 2) ** 2;

    const directDistance = earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(1, directDistance * 1.25);
}

function calculateDurationMinutes(distanceKm: number): number {
    return Math.max(5, Math.round((distanceKm / 45) * 60));
}

function calculatePrice(distanceKm: number): number {
    return Math.max(2, Math.round(distanceKm * 0.35));
}

const CreateRidePage: React.FC = () => {
    const { addRide } = useRideContext();
    const { currentUser } = useUserContext();
    const navigate = useNavigate();

    const [form, setForm] = useState<RideForm>({
        departure: "",
        destination: "",
        dateTime: "",
        seats: 1,
        extra: "",
    });
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: name === "seats" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        setMessage("");

        const departureCoords =
            (await geocodeAddress(form.departure)) ?? defaultStartCoords;
        const destinationCoords =
            (await geocodeAddress(form.destination)) ?? defaultDestinationCoords;
        const distanceKm = calculateDistanceKm(departureCoords, destinationCoords);

        const newRide: NewRide = {
            departureName: form.departure.trim(),
            destinationName: form.destination.trim(),
            departureCoords,
            destinationCoords,
            distanceKm,
            durationMinutes: calculateDurationMinutes(distanceKm),
            driver: currentUser?.profile.firstName ?? "Unbekannt",
            avatarUrl: "/images/lisa.jpg",
            departureTime: form.dateTime,
            seatsAvailable: form.seats,
            price: calculatePrice(distanceKm),
            extra: form.extra.trim(),
        };

        addRide(newRide);
        setMessage("Fahrt wurde gespeichert und wird jetzt auf Home und Fahrt finden angezeigt.");
        setForm({
            departure: "",
            destination: "",
            dateTime: "",
            seats: 1,
            extra: "",
        });
        setIsSaving(false);

        setTimeout(() => {
            navigate("/home");
        }, 800);
    };

    return (
        <div>
            <Header />
            <main>
                <div className="content-wrapper">
                    <section>
                        <h2>Fahrt anbieten</h2>

                        {message !== "" && <p className="success-message">{message}</p>}

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
                                    placeholder="z.B. Universität Konstanz"
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

                            <button
                                type="submit"
                                className="create-ride-submit-button"
                                disabled={isSaving}
                            >
                                {isSaving ? "Fahrt wird gespeichert..." : "Fahrt veröffentlichen"}
                            </button>
                        </form>
                    </section>
                    <InfoBox />
                </div>

                <div className="map-wrapper">
                    <h3>Routenvorschau</h3>
                    <RouteMap departure={form.departure} destination={form.destination} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateRidePage;
