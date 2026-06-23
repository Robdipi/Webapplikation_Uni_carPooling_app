import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";
import "../style.css";

const NotFoundPage: React.FC = () => {
    const { currentUser } = useUserContext();
    const homeTarget = currentUser === null ? "/" : "/home";

    return (
        <div className="start-page">
            <header>
                <div className="logo">
                    <Link to={homeTarget} className="open-btn">
                        CampusRide
                    </Link>
                </div>
            </header>

            <main>
                <h1>Seite nicht gefunden</h1>
                <p>Die angeforderte Seite existiert nicht oder wurde verschoben.</p>
                <p>
                    <Link to={homeTarget} className="extra-info-btn">
                        Zurück zur Startseite
                    </Link>
                </p>
            </main>
        </div>
    );
};

export default NotFoundPage;
