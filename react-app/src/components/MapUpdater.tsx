import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { Coordinates } from "../contexts/ridecontext";

interface MapUpdaterProps {
    start: Coordinates;
    end: Coordinates;
}

export default function MapUpdater({ start, end }: MapUpdaterProps) {
    const map = useMap();

    useEffect(() => {
        map.fitBounds(
            [
                [start.lat, start.lng],
                [end.lat, end.lng],
            ],
            { padding: [40, 40] },
        );
    }, [start, end, map]);

    return null;
}
