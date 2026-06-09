import React, { useState } from "react";
import "../style.css";
import "../home/rout_recomendation.css";
import "./searchbar.css";

interface Ride {
    from: string;
    to: string;
    driver: string;
    time: string;
    seatsAvailable: number;
    price: number;
    avatarUrl: string;
    mapUrl: string;
}

const rides: Ride[] = [
    {
        from: "Bremen",
        to: "Hannover",
        driver: "Lisa",
        time: "15:00 Uhr",
        seatsAvailable: 3,
        price: 8,
        avatarUrl: "../../images/lisa.jpg",
        mapUrl: "../../images/map_placeholder.png",
    },
];

const Header: React.FC = () => (
    <header>
        <div className="logo">CampusRide</div>
        <nav>
            <a href="../home/home.html" className="open-btn">Home</a>
            <a href="../chat/chat.html" className="open-btn">Chat</a>
            <a href="../create_ride/create_ride.html" className="open-btn">Fahrt anbieten</a>
            <a href="../find_ride/find_ride.html" className="open-btn">Fahrt finden</a>
            <a href="../profile/profile.html" className="open-btn">Profil</a>
            <a href="../index.html" className="open-btn">Abmelden</a>
        </nav>
    </header>
);

const Footer: React.FC = () => (
    <footer>
        <a href="../impressum/impressum.html" className="extra-info-btn">Impressum</a> |{" "}
        <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

const RideCard: React.FC<{ ride: Ride }> = ({ ride }) => (
    <li className="rides-list-entry">
        <div className="map-item">
            <div className="map">
                <img src={ride.mapUrl} alt="MapUI" className="karte" />
            </div>
        </div>
        <div className="ride-item">
            <article className="ride-card">
                <div className="ride-info">
                    <img src={ride.avatarUrl} alt={`Profilbild von ${ride.driver}`} className="avatar" />
                    <div className="details">
                        <h3>{ride.from} &rarr; {ride.to}</h3>
                        <p>
                            {ride.driver}, {ride.time}, {ride.seatsAvailable} freie Plätze, <strong>€{ride.price}</strong>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </li>
);

const SearchBar: React.FC<{ onSearch: (from: string, to: string, date: string, time: string) => void }> = ({ onSearch }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(from, to, date, time);
    };

    return (
        <div className="searchbar-holder">
            <div className="searchbar">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="searchbarinputfield"
                        placeholder="von"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        required
                    />
                    <img src="../../images/Ui_elements/right-arrow.png" alt="icon" style={{ width: 16, height: 16 }} />
                    <input
                        type="text"
                        className="searchbarinputfield"
                        placeholder="nach"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                    />
                    <label htmlFor="date" className="seachbar-label">Am:</label>
                    <input
                        type="date"
                        className="searchbarinputfield"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <label htmlFor="time" className="seachbar-label">Um:</label>
                    <input
                        type="time"
                        className="searchbarinputfield"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <button type="submit" className="search-bar-submit-button">
                        <img src="../../images/Ui_elements/search.png" alt="icon" style={{ width: 16, height: 16 }} /> Suchen
                    </button>
                </form>
            </div>
        </div>
    );
};

// Main Dashboard Component
const FindRideDashboard: React.FC = () => {
    const handleSearch = (from: string, to: string, date: string, time: string) => {
        console.log("Searching for rides:", { from, to, date, time });
        // You can replace this with API call logic
    };

    return (
        <div>
            <Header />
            <main>
                <h2>Fahrt finden</h2>
                    <SearchBar onSearch={handleSearch} />
                    <ul className="rides-list">
                    {rides.map((ride, index) => (
                        <RideCard key={index} ride={ride} />
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default FindRideDashboard;