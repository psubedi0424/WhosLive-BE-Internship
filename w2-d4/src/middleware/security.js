// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import mongoSanitize from "express-mongo-sanitize";
// import express from "express";

// export const securityPack = (app) => {
//     // Secure headers
//     app.use(helmet());

//     // Limit JSON payloads
//     app.use(express.json({ limit: "10kb" }));

//     // Prevent NoSQL injection
//     app.use(
//         mongoSanitize({
//             replaceWith: "_",
//             allowDots: true,
//         })
//     );

//     // Rate limit
//     app.use(
//         rateLimit({
//             windowMs:1 * 60 * 1000,
//             max: 30,
//             message: { success: false, message: "Too many requests" }
//         })
//     );
// };

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express from "express";
import { sanitizeInput } from "./sanitize.js";

export const securityPack = (app) => {
    // Secure headers
    app.use(helmet());

    // Prevent JSON payload attacks
    app.use(express.json({ limit: "10kb" }));

    // Replace express-mongo-sanitize
    app.use(sanitizeInput);

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 30,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: "Too many requests",
        },
    });

    app.use(limiter);
};
