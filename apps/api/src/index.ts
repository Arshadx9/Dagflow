import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "./shared/config";
import { startBackgroundJobs, stopBackgroundJobs } from "./background";
import runrouter from "./services/Run/runroutes";
import schedulerouter from "./services/Schedules/schedulerouter";
import authrouter from "./services/auth/authroutes";
import flowrouter from "./services/workflow/flowrouter";
import Apperror from "./shared/utils/Apperror";
import Responseformatter from "./shared/utils/Responseformatter";

const app = express();
const PORT = Number(process.env.PORT) || 8000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions: cors.CorsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			callback(null, true);
			return;
		}

		if (allowedOrigins.includes(origin)) {
			callback(null, true);
			return;
		}

		callback(new Error(`CORS blocked for origin: ${origin}`));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({ success: true, data: "Dagflo API is running" });
});

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({ success: true, data: "ok" });
});

app.use("/api/auth", authrouter);
app.use("/api/workflow", flowrouter);
app.use("/api/run", runrouter);
app.use("/api/schedule", schedulerouter);

app.use((req: Request, _res: Response, next: NextFunction) => {
	next(new Apperror(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof Apperror) {
		res.status(err.statuscode).json(Responseformatter.error(err.message));
		return;
	}

	console.error("Unhandled error:", err);
	if (process.env.NODE_ENV !== "production" && err instanceof Error) {
		res.status(500).json(Responseformatter.error(err.message));
		return;
	}

	res.status(500).json(Responseformatter.error("Internal server error"));
});

app.listen(PORT, () => {
	console.log(`Dagflo API running on port ${PORT}`);
	startBackgroundJobs();
});

const shutdown = async (signal: NodeJS.Signals) => {
	console.log(`Received ${signal}, shutting down`);
	await stopBackgroundJobs();
	process.exit(0);
};

process.on("SIGTERM", () => {
	void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
	void shutdown("SIGINT");
});

export default app;
