import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import "./rout_recomendation.css";
import "./popup.css";

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
            <Link to="/home" className="open-btn">
                Home
            </Link>
            <Link to="/chat" className="open-btn">
                Chat
            </Link>
            <Link to="/create-ride" className="open-btn">
                Fahrt anbieten
            </Link>
            <Link to="/find-ride" className="open-btn">
                Fahrt finden
            </Link>
            <Link to="/profile" className="open-btn">
                Profil
            </Link>
            <Link to="/" className="open-btn">
                Abmelden
            </Link>
        </nav>
    </header>
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
                    <img
                        src={ride.avatarUrl}
                        alt={`Profilbild von ${ride.driver}`}
                        className="avatar"
                    />
                    <div className="details">
                        <h3>
                            {ride.from} &rarr; {ride.to}
                        </h3>
                        <p>
                            {ride.driver}, {ride.time}, {ride.seatsAvailable} freie Plätze,{" "}
                            <strong>€{ride.price}</strong>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    </li>
);

const Footer: React.FC = () => (
    <footer>
        <Link to="/impressum" className="extra-info-btn">
            Impressum
        </Link>{" "}
        | <a href="#" className="extra-info-btn">Copyright</a> |{" "}
        <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

const HomePage: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <h2>Deine Fahrten:</h2>
                <ul className="rides-list">
                    {rides.map((ride) => (
                        <RideCard key={`${ride.from}-${ride.to}-${ride.time}`} ride={ride} />
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
