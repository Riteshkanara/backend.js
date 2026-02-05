import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    // Return a simple OK status with a success message
    return res
        .status(200)
        .json({
            status: "OK",
            message: "System is up and running",
            timestamp: new Date().toISOString()
        });
});


export {
    healthcheck
    }
    