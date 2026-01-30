import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to database")

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1)
    }
}

main()