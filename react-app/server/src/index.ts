import { app } from "./app.js";
import { seed } from "./seed.js";

const port = parseInt(process.env.PORT ?? "3001", 10);

async function start() {
    await seed();
    console.log("Seed-Daten wurden geprüft.");

    app.listen(port, () => {
        console.log(`CampusRide backend läuft auf http://localhost:${port}`);
    });
}

start();