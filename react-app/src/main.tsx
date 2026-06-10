import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import HomePageRouts from "./StartPage"; // This is your routes component
import "./pages/style.css";
import "./pages/popup.css";
import {AppProviders} from "./contexts/AppProviders";
import "leaflet/dist/leaflet.css";


const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <AppProviders>
            <BrowserRouter>
                <HomePageRouts /> {/* Render the routes component */}
            </BrowserRouter>
        </AppProviders>
    </React.StrictMode>
);