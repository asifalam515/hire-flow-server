import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import { adminRouter } from "./app/module/Admin/admin.router";
import { analyticsRouter } from "./app/module/Analytics/analytics.router";
import { applicationRouter } from "./app/module/Applications/application.router";
import { educationRouter } from "./app/module/Candidate/education.router";
import { profileRouter } from "./app/module/Candidate/profile.router";
import { savedJobsRouter } from "./app/module/Candidate/savedJobs.router";
import { workExperienceRouter } from "./app/module/Candidate/workExperience.router";
import { companyRouter } from "./app/module/Company/company.router";
import { jobRouter } from "./app/module/Jobs/Job.router";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/errorHandler";
const app = express();
const port = 5000; // The port your express server will be running on.
app.use(cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
}));
// Better Auth routes
app.all("/api/auth", toNodeHandler(auth));
app.all("/api/auth/*authPath", toNodeHandler(auth));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Routes
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/candidate/profile", profileRouter);
app.use("/api/v1/candidate/work-experience", workExperienceRouter);
app.use("/api/v1/candidate/education", educationRouter);
app.use("/api/v1/saved-jobs", savedJobsRouter);
// Basic route
app.get("/", (req, res) => {
    res.send("Hello, TypeScript + Express!");
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.use(errorHandler);
// Start the server
// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new IOServer(server, {
    cors: { origin: "http://localhost:3000", credentials: true },
});
import { addConnectedUser, authenticateSocket, removeConnectedUser, setIO, } from "@lib/socket";
setIO(io);
io.on("connection", (socket) => {
    console.log("Socket connection attempt", socket.id);
    // Authenticate socket connection
    authenticateSocket(socket).then((userId) => {
        if (!userId) {
            console.log("Socket authentication failed", socket.id);
            socket.disconnect(true);
            return;
        }
        // Store userId in socket data for later use
        socket.data.userId = userId;
        // Add user to connected users and join their user room
        addConnectedUser(userId, socket.id);
        socket.join(`user:${userId}`); // Join personal room for direct messaging
        console.log(`User ${userId} connected with socket ${socket.id}`);
        // Notify user of successful connection
        socket.emit("auth:success", { userId, socketId: socket.id });
        // Listen for user joining rooms (e.g., application updates)
        socket.on("join:application", (applicationId) => {
            socket.join(`application:${applicationId}`);
            console.log(`User ${userId} joined application room: ${applicationId}`);
        });
        socket.on("leave:application", (applicationId) => {
            socket.leave(`application:${applicationId}`);
            console.log(`User ${userId} left application room: ${applicationId}`);
        });
        // Listen for user joining job rooms
        socket.on("join:job", (jobId) => {
            socket.join(`job:${jobId}`);
            console.log(`User ${userId} joined job room: ${jobId}`);
        });
        socket.on("leave:job", (jobId) => {
            socket.leave(`job:${jobId}`);
            console.log(`User ${userId} left job room: ${jobId}`);
        });
    });
    socket.on("disconnect", () => {
        // Get userId from socket data
        const userId = socket.data.userId || socket.handshake.auth.userId;
        if (userId) {
            removeConnectedUser(userId, socket.id);
            console.log(`User ${userId} disconnected with socket ${socket.id}`);
        }
        else {
            console.log(`Socket ${socket.id} disconnected (unauthenticated)`);
        }
    });
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map