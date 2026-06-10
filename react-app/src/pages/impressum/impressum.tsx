import React from "react";
import "../style.css";
import {Link} from "react-router-dom";

const Header: React.FC = () => (
    <header>
        <link rel="stylesheet" href="../style.css" />
        <div className="logo">
            <Link to="/" className="open-btn">
                CampusRide
            </Link>
        </div>
    </header>
);

/*
<a href="../index.html" className="open-btn">
                CampusRide
            </a>
*/
interface InfoSectionProps {
    title: string;
    children: React.ReactNode;
}
const InfoSection: React.FC<InfoSectionProps> = ({title, children}) => (
    <section>
        <h2>{title}</h2>
        {children}
    </section>
);

const ImpressumPage: React.FC = () => {
    return (
        <div>
            <Header />
                <main>
                    <h1>Impressum</h1>
                        <InfoSection title="Angaben gemäß § 5 DDG">
                            <address>
                                Marco Reus <br />
                                Straßestraße 12 <br />
                                78462 Konstanz <br />
                                Deutschland
                            </address>
                        </InfoSection>

                        <InfoSection title="Kontakt">
                            <p>
                                E-Mail:{" "}
                                <a href="mailto:max.mustermann@example.com">
                                    max.mustermann@example.com
                                </a>
                            </p>
                        </InfoSection>

                        <InfoSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
                            <address>
                                Michael Jordan <br />
                                Ahornstraße 12 <br />
                                78462 Konstanz
                            </address>
                        </InfoSection>

                        <InfoSection title="Hinweis">
                            <p>
                                Dies ist ein studentisches Projekt im Rahmen des Studiums an der HTWG
                                Konstanz.
                            </p>
                        </InfoSection>
                </main>
        </div>
    );
};

export default ImpressumPage;