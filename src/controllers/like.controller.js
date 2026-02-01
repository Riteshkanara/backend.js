import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError (400, "Invalid videoId")
    }
    const existingLike = await Like.findOne(
        {video : videoId, likedBy: req.user._id}
    )
    if(existingVideoLike){
        //unlike
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
            new ApiResponse(
                200,
                "Video unliked successfully",
                null
            )
        )
    }else{
        //like
        const newLike = new Like({
            video: videoId,
            likedBy: req.user._id,
            
        })
        await newLike.save()

        return res.status(200).json(
            new ApiResponse(
                200,
                "Video liked successfully",
                null
            )
        )
    }
    

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId");
    }

    // Try to delete (unlike) - single DB call
    const existingTweetLike = await Like.findOneAndDelete({
        tweet: tweetId, 
        likedBy: req.user._id
    });

    if (existingTweetLike){
        // Was unliked
        return res.status(200).json(
            new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully")
        );
    }

    // Create new like
    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, { isLiked: true }, "Tweet liked successfully")
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id

    const likedVideos = await Like.find(
        {likedBy: userId, video:{$exists: true}}.populate({
            path: "video",
            populate: {path: "owner", select: "username fullName avatar"}
        })
    )
    if(!likedVideo || likedVideos.length === 0){  
        return res.status(200).json(
            new ApiResponse(200, [], "No liked videos found")
        )
    }
    else{
        const videos = likedVideos.map(like => like.video)
        return res.status(200).json(
            new ApiResponse(200, videos, "Liked videos retrieved successfully")
        )
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}