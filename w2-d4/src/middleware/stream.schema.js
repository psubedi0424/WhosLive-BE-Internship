// import { z } from "zod";

// export const createStreamSchema = z.object({
//     title: z.string().min(3),
//     category: z.string().min(2),
//     isLive: z.boolean().optional(),
//     viewerCount: z.number().int().nonnegative().optional()
// });



import { z } from "zod";

// Schema for validating query params for GET /streams
export const streamQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 1))
        .refine((n) => n >= 1, { message: "Page must be >= 1" }),

    limit: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 5))
        .refine((n) => n >= 1 && n <= 50, {
            message: "Limit must be between 1 and 50",
        }),
});

// Middleware to validate query params
export const validateStreamQuery = (req, res, next) => {
    try {
        const result = streamQuerySchema.parse(req.query);
        req.query = result; // safe values
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.errors?.[0]?.message || "Invalid query parameters",
        });
    }
};
