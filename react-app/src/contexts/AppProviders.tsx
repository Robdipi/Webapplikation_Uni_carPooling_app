import { ReactNode } from "react";
import { GlobalContextProvider } from "./globalcontext";
import { RideContextProvider } from "./ridecontext";
import { UserContextProvider } from "./usercontext";
import { ChatContextProvider } from "./chatcontext";

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <GlobalContextProvider>
            <UserContextProvider>
                <RideContextProvider>
                    <ChatContextProvider>{children}</ChatContextProvider>
                </RideContextProvider>
            </UserContextProvider>
        </GlobalContextProvider>
    );
}
