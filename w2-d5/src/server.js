
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./db.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/analytics", analyticsRoutes);

app.get("/", (req, res) => res.send("Analytics API running"));

const start = async () => {
    await connectDB();
    app.listen(process.env.PORT, () =>
        console.log("Server running on port", process.env.PORT)
    );
};

start();

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import { connectDB } from "./db.js";
// import streamRoutes from "./routes/stream.routes.js";

// dotenv.config();

// console.log("🔥 Starting server.js");

// const app = express();

// // Basic middlewares
// app.use(cors());
// app.use(express.json());

// // TEST ROUTE
// app.get("/health", (req, res) => {
//     res.json({ status: "ok" });
// });

// // Routes
// app.use("/streams", streamRoutes);

// // Global error handler
// app.use((err, req, res, next) => {
//     console.error("🔥 Error:", err);
//     res.status(500).json({ success: false, message: err.message });
// });

// const start = async () => {
//     console.log("Connecting DB...");
//     await connectDB();

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//         console.log(" Server running on port", PORT);
//     });
// };

// start();


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import { connectDB } from "./db.js";
// import streamRoutes from "./routes/stream.routes.js";
// // import { securityPack } from "./middleware/security.js";

// dotenv.config();

// const app = express();

// // Core middleware
// app.use(cors());

// // Security middleware (Helmet, Rate limit, Sanitization)
// // securityPack(app);

// // Routes
// app.use("/streams", streamRoutes);
// app.get('/test', (req, res) => {
//     res.json({ message: 'Server is working!', timestamp: new Date() });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//     console.error("🔥 Error:", err);
//     res.status(500).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//     });
// });

// // Start server
// const start = async () => {
//     try {
//         console.log("Connecting DB...");
//         await connectDB();
    
//         const PORT = process.env.PORT;
//         app.listen(PORT, () => {
//             console.log(` Server running on port ${PORT}`);
//         });
//     }
//     catch (error) {
//         console.error("Failed to start server:", error);
//     }
// };

// start();
