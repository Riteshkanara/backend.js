import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content} = req.body;
    if(!content || content.trim() === ""){
        throw new ApiError(400, "Tweet content cannot be empty");
    }
    if(!req.user || !isValidObjectId(req.user._Id)){
        throw new ApiError(401, "Unauthorized");
    }
    const tweet = new Tweet.create({
        content: content,
        owner: req.user._id
    });
    await tweet.save();

    res.status(201)
    .json
    (
        new ApiResponse
        (201,
        "Tweet created successfully",
        tweet
    ));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if(!isValidObjectId(userId)){
    throw new ApiError(401, "Unauthorized");
    }
    const tweet = await Tweet.find({
        owner: userId
    }).populate({
        path: "owner",
        select: "username name avatar"
    }).sort({createdAt: -1})
    .skip({skip})
    .limit({limit});
    //try this mongoose aggregate paginate later

    res.status(200)
    .json
    (
        new ApiResponse
        (200,
        "User tweets fetched successfully",
        tweet
    ));
});


const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const tweetId = req.params.tweetId;
    const {content} = req.body;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID");
    }
    if(!content || content.trim() === ""){
        throw new ApiError(400, "Tweet content cannot be empty");
    }
    if(!req.user || !isValidObjectId(req.user._id)){
        throw new ApiError(401, "Unauthorized");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You can only update your own tweets");
    }
    // tweet.content = content;
    // await tweet.save();
    //Another  way to update the Tweet :

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content: content},
        {new: true}
    );
    res.status(200)
    .json
    (
        new ApiResponse
        (200,
        updatedTweet,
        "Tweet updated successfully"
    ));

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweetId = req.params.tweetId;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID");
    }
    if(!req.user || !isValidObjectId(req.user._id)){
        throw new ApiError(401, "Unauthorized");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }   
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You can only delete your own tweets");
    }
    await Tweet.findByIdAndDelete(tweetId);

    res.status(200)
    .json
    (
        new ApiResponse
        (200,
        null,
        "Tweet deleted successfully",
        
    ));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}