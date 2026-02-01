import Router from "express";
import { createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet } from "../controllers/tweet.controller.js";
import { verify } from "jsonwebtoken";

const router = Router();

router.post("/", verify, createTweet);
router.get("/", verify, getUserTweets);
router.put("/:id", verify, updateTweet);
router.delete("/:id", verify, deleteTweet);

export default router;