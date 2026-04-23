import { toNodeHandler } from "better-auth/node";
import type { Application, Request, Response } from "express";
import express from "express";
import { auth } from "./lib/auth";

const app: Application = express();
const port = 5000; // The port your express server will be running on.
app.all("/api/auth", toNodeHandler(auth));
app.all("/api/auth/*authPath", toNodeHandler(auth));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
