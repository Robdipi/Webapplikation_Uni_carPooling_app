import type { ReactNode } from "react";
import { ChatContextProvider } from "./chatcontext";
import { GlobalContextProvider } from "./globalcontext";
import { RideContextProvider } from "./ridecontext";
import { UserContextProvider } from "./usercontext";

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <GlobalContextProvider>
            <RideContextProvider>
                <UserContextProvider>
                    <ChatContextProvider>{children}</ChatContextProvider>
                </UserContextProvider>
            </RideContextProvider>
        </GlobalContextProvider>
    );
}
