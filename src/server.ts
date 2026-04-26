import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();
const port = 5000; // The port your express server will be running on.
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  }),
);
app.all("/api/auth", toNodeHandler(auth));
app.all("/api/auth/*authPath", toNodeHandler(auth));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
