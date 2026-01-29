import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const {page = 1, limit = 10,  query, sortBy, sortType, userId } = req.query;
    
    const pageNum = Math.max(parseInt(req.query.page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    
    const sortField = sortBy || "createdAt";
    const sortOrder = sortType === "asc" ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    // Build match conditions
    const matchConditions = { isPublished: true };
    
    if (userId) {
        if(!isValidObjectId(userId)){
            throw new ApiError (400, "Invalid userId");
        }
        matchConditions.owner = new mongoose.Types.ObjectId(userId);
    }

    const user = await User.aggregate([
        //match 
        {
        $match : {
            _id: new mongoose.Types.ObjectId(userId)
        },
    },
        {
            $lookup: {
                from:"videos",
                localField:"_id",
                foreignField:"videos",
                as:"videos"
            }
                
        },
        //unwind the videos array to process each video individually
        {
            $unwind: "$videos"
        },
        //match published videos
        {
            $match: {
                ...(query && {"videos.title":{regex:query, $options:"i"}}),
        }
        },
        {
            $sort:{
                [`videos.${sortBy}`]: sortType === "asc" ? 1: -1 ;
            }
        },

        {
             $skip: skip 
        },
        
        {
             $limit: limitNum 
        },
        {
            $group:{
                _id: "$_id",
                videos: { $push: "$videos" }
            }
        },
        
    ])

    if(!user.length){
        throw new ApiError (404, "No videos found for the specified user");
    }

    // Extract videos from the aggregated result
    const videos = user[0].videos;
    const totalVideos = await Video.countDocuments(matchConditions);
    
    // Return with pagination metadata
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalVideos,
                totalPages: Math.ceil(totalVideos / limit),
                hasNextPage: page * limit < totalVideos,
                hasPreviousPage: page > 1
            }
        }, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

export { getAllVideos }