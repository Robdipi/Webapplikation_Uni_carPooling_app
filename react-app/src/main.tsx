import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./contexts/AppProviders";
import AppRoutes from "./routes/AppRoutes";
import "leaflet/dist/leaflet.css";
import "./pages/popup.css";
import "./pages/style.css";

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <AppProviders>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AppProviders>
    </React.StrictMode>
);
