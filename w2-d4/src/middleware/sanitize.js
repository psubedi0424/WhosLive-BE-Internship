// sanitize.js — Manual anti-NoSQL injection sanitizer

export function sanitizeInput(req, res, next) {
    const sanitize = (value) => {
        if (typeof value === "object" && value !== null) {
            for (const key in value) {
                // Block MongoDB operators like $gt, $ne, $regex, etc.
                if (key.startsWith("$")) {
                    delete value[key];
                } else {
                    sanitize(value[key]);
                }
            }
        }
    };

    sanitize(req.body);
    sanitize(req.params);
    sanitize(req.query);

    next();
}
