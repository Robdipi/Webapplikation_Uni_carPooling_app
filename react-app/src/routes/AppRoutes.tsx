import { Navigate, Route, Routes } from "react-router-dom";
import StartPage from "../StartPage";
import ChatPage from "../pages/chat/chat";
import CreateRidePage from "../pages/create_ride/create_ride";
import FindRidePage from "../pages/find_ride/find_ride";
import HomePage from "../pages/home/home";
import ImpressumPage from "../pages/impressum/impressum";
import NotFoundPage from "../pages/not_found/NotFoundPage";
import ProfilePage from "../pages/profile/profile";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-ride"
                element={
                    <ProtectedRoute>
                        <CreateRidePage />
                    </ProtectedRoute>
                }
            />
            <Route path="/create_ride" element={<Navigate to="/create-ride" replace />} />

            <Route
                path="/find-ride"
                element={
                    <ProtectedRoute>
                        <FindRidePage />
                    </ProtectedRoute>
                }
            />
            <Route path="/find_ride" element={<Navigate to="/find-ride" replace />} />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
