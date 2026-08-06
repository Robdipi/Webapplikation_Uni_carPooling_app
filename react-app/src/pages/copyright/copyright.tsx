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

const CopyrightPage: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <div>
            <Header />
            <main>
                <h1>Copyright</h1>

                <InfoSection title="Eigene Inhalte">
                    <p>
                        © {year} CampusRide. Alle Texte, Grafiken und der Quellcode dieser
                        Anwendung sind, sofern nicht anders angegeben, Eigentum der
                        CampusRide-Projektgruppe im Rahmen eines studentischen Projekts an der
                        HTWG Konstanz.
                    </p>
                </InfoSection>

                <InfoSection title="Kartenmaterial">
                    <p>
                        Kartendarstellung und Geodaten: © OpenStreetMap-Mitwirkende, verfügbar
                        unter der{" "}
                        <a
                            href="https://opendatacommons.org/licenses/odbl/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open Data Commons Open Database License (ODbL)
                        </a>
                        .
                    </p>
                </InfoSection>

                <InfoSection title="Drittanbieter-Software">
                    <p>
                        Diese Anwendung nutzt verschiedene Open-Source-Bibliotheken (u. a. React,
                        Leaflet, Express, Prisma). Die jeweiligen Lizenzbedingungen der
                        eingesetzten Pakete sind in der{" "}
                        <code>package.json</code> bzw. den zugehörigen Repositories der
                        Bibliotheken einsehbar.
                    </p>
                </InfoSection>

                <InfoSection title="Hinweis">
                    <p>
                        Dies ist ein studentisches Projekt im Rahmen des Studiums an der HTWG
                        Konstanz und dient ausschließlich Lehrzwecken.
                    </p>
                </InfoSection>
            </main>
        </div>
    );
};

export default CopyrightPage;
