import React from "react";
import "../style.css";
import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/usercontext";

const Header: React.FC = () => {
    const { currentUser } = useUserContext();

    return (
        <header>
            <div className="logo">
                <Link to={currentUser === null ? "/" : "/home"} className="open-btn">
                    CampusRide
                </Link>
            </div>
        </header>
    );
};

interface InfoSectionProps {
    title: string;
    children: React.ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
    <section>
        <h2>{title}</h2>
        {children}
    </section>
);

const ContactPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Kontakt</h1>

                <InfoSection title="Allgemeine Anfragen">
                    <p>
                        Bei Fragen, Feedback oder Problemen mit CampusRide erreichst du uns unter:
                    </p>
                    <p>
                        E-Mail:{" "}
                        <a href="mailto:support@campusride.example.com">
                            support@campusride.example.com
                        </a>
                    </p>
                </InfoSection>

                <InfoSection title="Team">
                    <p>
                        CampusRide ist ein studentisches Projekt von Robin Dietsche, Marlin
                        Wießenberg und Paul Boos im Rahmen des Studiums an der HTWG Konstanz.
                    </p>
                </InfoSection>

                <InfoSection title="Hinweis">
                    <p>
                        Für rechtliche Angaben zum Anbieter siehe das{" "}
                        <Link to="/impressum">Impressum</Link>.
                    </p>
                </InfoSection>
            </main>
        </div>
    );
};

export default ContactPage;
