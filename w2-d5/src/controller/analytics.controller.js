import { Stream } from "../models/stream.model.js";
import { Creator } from "../models/creator.model.js";
import { Category } from "../models/category.model.js";

// ------------------------------
// TOP CREATORS
// ------------------------------
export const getTopCreators = async (req, res, next) => {
    try {
        const result = await Stream.aggregate([
            {
                $group: {
                    _id: "$creator",
                    totalViewers: { $sum: "$viewerCount" },
                    streamCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "creators",
                    localField: "_id",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            { $unwind: "$creator" },
            { $sort: { totalViewers: -1 } },
            { $limit: 5 }
        ]);

        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};


// ------------------------------
// LIVE COUNT BY CATEGORY
// ------------------------------
export const getLiveByCategory = async (req, res, next) => {
    try {
        const result = await Stream.aggregate([
            { $match: { isLive: true } },
            {
                $group: {
                    _id: "$category",
                    liveStreams: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" }
        ]);

        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};