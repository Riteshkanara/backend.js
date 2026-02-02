import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId");
    }

    const existingLike = await Like.findOneAndDelete({
        video: videoId, 
        likedBy: req.user._id
    });

    if(existingLike){
        return res.status(200).json(
            new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
        );
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, { isLiked: true }, "Video liked successfully")
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId");
    }

    const existingCommentLike = await Like.findOneAndDelete({
        comment: commentId, 
        likedBy: req.user._id
    });

    if(existingCommentLike){
        return res.status(200).json(
            new ApiResponse(200, { isLiked: false }, "Comment unliked successfully")
        );
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, { isLiked: true }, "Comment liked successfully")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId");
    }

    const existingTweetLike = await Like.findOneAndDelete({
        tweet: tweetId, 
        likedBy: req.user._id
    });

    if(existingTweetLike){
        return res.status(200).json(
            new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully")
        );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, { isLiked: true }, "Tweet liked successfully")
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const likedVideos = await Like.find({
        likedBy: userId, 
        video: {$exists: true}
    }).populate({
        path: "video",
        populate: {
            path: "owner", 
            select: "username fullName avatar"
        }
    }).lean();

    const videos = likedVideos.map(like => like.video);

    return res.status(200).json(
        new ApiResponse(200, videos, "Liked videos retrieved successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}