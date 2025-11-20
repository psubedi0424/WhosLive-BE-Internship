import { ZodError } from "zod";

// export const validate = (schema) => (req, res, next) => {
//     try {
//         const parsed = schema.parse(req.body);
//         req.body = parsed; // sanitized validated body
//         next();
//     } catch (err) {
//         if (err instanceof ZodError) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation Error",
//                 errors: err.errors
//             });
//         }
//         next(err);
//     }
// };

export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body); // validated + sanitized
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.errors?.[0]?.message || "Invalid input"
        });
    }
};
