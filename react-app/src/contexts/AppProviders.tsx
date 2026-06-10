import {GlobalContextProvider} from "./globalcontext";
import {RideContextProvider} from "./ridecontext";
import {UserContextProvider} from "./usercontext";
import {ChatContextProvider} from "./chatcontext";

export function AppProviders({ children }) {
    return (
        <GlobalContextProvider>
            <RideContextProvider>
                <UserContextProvider>
                    <ChatContextProvider>
                        {children}
                    </ChatContextProvider>
                </UserContextProvider>
            </RideContextProvider>
        </GlobalContextProvider>
    );
}