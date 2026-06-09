import React from "react";
import "./style.css";
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

// Components
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

const Footer: React.FC = () => (
    <footer>
        <a href="../impressum/impressum.html" className="extra-info-btn">Impressum</a> |{" "}
    <a href="#" className="extra-info-btn">Copyright</a> |{" "}
    <a href="#" className="extra-info-btn">Kontakt</a>
    </footer>
);

const Dashboard: React.FC = () => {
    return (
        <div>
            <Header />
                <main>
                    <h2>Deine Fahrten:</h2>
                    <ul className="rides-list">
                        {rides.map((ride, index) => (<RideCard key={index} ride={ride} />))}
                    </ul>
                </main>
            <Footer />
        </div>
);
};

export default Dashboard;