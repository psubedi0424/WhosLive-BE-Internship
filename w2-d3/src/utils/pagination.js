import mongoose from "mongoose";
export function buildCursorQuery(cursor) {
    if (!cursor || !mongoose.Types.ObjectId.isValid(cursor)) { return {}; }
    return { _id: { $gt: new mongoose.Types.ObjectId(cursor) } };
}