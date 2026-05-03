import express from "express";
import moviesRoutes from "./routes/moviesRoutes.js"
import {config} from "dotenv";
import {connectDB, disconnectDB} from "./config/db.js";

config();
connectDB();


const app = express()


app.use('/movies', moviesRoutes)


const PORT = 5001;
const server = app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
});

// handle unhandled promise rejections

process.on("unhandledRejection",(err)=>{
    console.error("Unhandled Rejection: ", err);
    server.close(async ()=>{
        await disconnectDB();
        process.exit(1);
    })
})

// handle uncaught exceptions

process.on("uncaughtException",async (err)=>{
    console.error("Uncaught Exception: ", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async ()=>{
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(async ()=>{
        await disconnectDB();
        process.exit(0);
    });
});