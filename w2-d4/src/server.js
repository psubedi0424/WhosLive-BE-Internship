// // server.js
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import { connectDB } from "./db.js";
// import streamRoutes from "./routes/stream.routes.js";
// import { securityPack } from "./middleware/security.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// securityPack(app);

// // Health check endpoint
// app.get("/health", (req, res) => {
//     res.json({
//         status: "OK",
//         timestamp: new Date().toISOString(),
//         db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
//     });
// });

// app.use("/streams", streamRoutes);

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Route ${req.method} ${req.path} not found`
//     });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//     console.error("🔥 Error:", err);

//     // Mongoose validation error
//     if (err.name === 'ValidationError') {
//         return res.status(400).json({
//             success: false,
//             message: "Validation Error",
//             errors: Object.values(err.errors).map(e => ({
//                 field: e.path,
//                 message: e.message
//             }))
//         });
//     }

//     // Mongoose duplicate key error
//     if (err.code === 11000) {
//         return res.status(409).json({
//             success: false,
//             message: "Duplicate resource found"
//         });
//     }

//     res.status(500).json({
//         success: false,
//         message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
//     });
// });

// const start = async () => {
//     try {
//         await connectDB();
//         const PORT = process.env.PORT || 3000;
//         app.listen(PORT, () => {
//             console.log(` Server running on port ${PORT}`);
//             console.log(` Health check: http://localhost:${PORT}/health`);
//         });
//     } catch (error) {
//         console.error('Failed to start server:', error);
//         process.exit(1);
//     }
// };

// start();

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { connectDB } from "./db.js";
// import streamRoutes from "./routes/stream.routes.js";
// import { securityPack } from "./middleware/security.js";

// dotenv.config();

// const app = express();

// // Base middlewares
// app.use(cors());
// securityPack(app);

// // Routes
// app.use("/streams", streamRoutes);

// // Global error handler
// app.use((err, req, res, next) => {
//     console.error("🔥 Error:", err);
//     res.status(500).json({ success: false, message: err.message });
// });

// const start = async () => {
//     await connectDB();
//     app.listen(process.env.PORT, () =>
//         console.log("Server running on port", process.env.PORT)
//     );
// };

// start();


// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import mongoSanitize from "express-mongo-sanitize";
// import express from "express";

// export const securityPack = (app) => {
//     // Secure headers
//     app.use(helmet());

//     // Prevent large JSON payloads
//     app.use(express.json({ limit: "10kb" }));

//     // ---- FIX: safely sanitize req.body & req.params only ----
//     app.use(
//         mongoSanitize({
//             dryRun: true, // prevents rewriting req.query
//             onSanitize: ({ key }) => {
//                 console.log(`Sanitized field: ${key}`);
//             },
//         })
//     );

//     // Manual query sanitization (safe)
//     app.use((req, res, next) => {
//         const clean = (obj) => {
//             for (const key in obj) {
//                 if (key.startsWith("$")) delete obj[key];
//                 if (typeof obj[key] === "object") clean(obj[key]);
//             }
//         };
//         clean(req.query);
//         next();
//     });

//     // Rate limit middleware
//     const limiter = rateLimit({
//         windowMs: 1 * 60 * 1000,
//         max: 30,
//         message: { success: false, message: "Too many requests" },
//     });

//     app.use(limiter);
// };
// start();
// src/server.js
console.log("🔥 Starting server.js");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./db.js";
import streamRoutes from "./routes/stream.routes.js";
import { securityPack } from "./middleware/security.js";

dotenv.config();

const app = express();

// Core middleware
app.use(cors());

// Security middleware (Helmet, Rate limit, Sanitization)
securityPack(app);

// Routes
app.use("/streams", streamRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start server
const start = async () => {
    console.log("Connecting DB...");
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
};

start();



