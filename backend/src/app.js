
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";   

const app = express();

// app.use(cors({
//     origin: "http://localhost:5173" ,
//     credentials: true,
// }))
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "https://video-tube-in-final.vercel.app" // Your specific Vercel URL
];
const app = express();

// 1. HEADERS/CORS FIRST
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [process.env.CORS_ORIGIN, "https://video-tube-in-final.vercel.app"];
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// Add this right AFTER the cors middleware to handle "Preflight" requests explicitly

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true , limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());



//routes import 

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import playlistRouter from "./routes/playlist.routes.js"; 
import subscriptionRouter from "./routes/subscription.routes.js";
import { healthcheck } from "./controllers/healthcheck.controller.js";
import dashboardRouter from "./routes/dashboard.routes.js";
// routes declaration 

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/healthcheck", healthcheck);
app.use("/api/v1/dashboard", dashboardRouter);


//exporting app so that it can be used in server.js to listen on a port
  //these can be use as a prefix for routes(up)

export {app}