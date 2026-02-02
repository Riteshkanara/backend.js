import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    if(channelId.toString() === req.user._id.toString()){
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const channel = await User.findById(channelId).select('_id');
    if(!channel){
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOneAndDelete({
        subscriber: req.user._id,
        channel: channelId
    });

    if(existingSubscription){
        return res.status(200).json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
        );
    }

    const newSubscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({channel: channelId})
        .populate({
            path: "subscriber",
            select: "username fullName avatar"
        })
        .sort({createdAt: -1})
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                subscribers: subscribers,
                totalCount: subscribers.length
            },
            "Channel subscribers fetched successfully"
        )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate({
            path: "channel",
            select: "username fullName avatar"
        })
        .sort({ createdAt: -1 })
        .lean();

    const channels = subscriptions.map(sub => sub.channel);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                channels: channels,
                totalCount: channels.length
            },
            channels.length > 0 
                ? "Subscribed channels fetched successfully"
                : "No subscriptions yet"
        )
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}