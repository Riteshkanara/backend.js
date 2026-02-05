import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const stats = await Video.aggregate([
        // 1. Match videos belonging to the current user
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        // 2. Join with Likes collection to get video likes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        // 3. Group all videos to calculate totals
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: { $size: "$likes" } }
            }
        }
    ]);

    // 4. Get total subscriber count from Subscription collection
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    // Handle case where user has no videos yet
    const channelStats = {
        totalSubscribers,
        totalViews: stats[0]?.totalViews || 0,
        totalVideos: stats[0]?.totalVideos || 0,
        totalLikes: stats[0]?.totalLikes || 0
    };

    return res
        .status(200)
        .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"));
});


const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Find all videos where the owner matches the current user
    const videos = await Video.find({
        owner: userId
    }).sort({ createdAt: -1 }); // Sort by newest first

    // Check if videos exist
    if (!videos) {
        throw new ApiError(404, "No videos found for this channel");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                videos, 
                "Channel videos fetched successfully"
            )
        );
});



export { getChannelStats, getChannelVideos}