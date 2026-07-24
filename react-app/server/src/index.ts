import { app } from "./app.js";

const port = parseInt(process.env.PORT ?? "3001", 10);

app.listen(port, () => {
    console.log(`CampusRide backend läuft auf http://localhost:${port}`);
});