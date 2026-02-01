import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    video:{
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
    likedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
    
},
{timestamps: true}
);

// ✅ Add validation to ensure at least one target exists
// I didnt uderstand this part -
likeSchema.pre('save', function(next) {
    const hasTarget = this.video || this.comment || this.tweet;
    if (!hasTarget) {
        next(new Error('Like must have a target (video, comment, or tweet)'));
    }
    // Ensure only one target is set
    const targetCount = [this.video, this.comment, this.tweet].filter(Boolean).length;
    if (targetCount > 1) {
        next(new Error('Like can only have one target'));
    }
    next();
});

export const Like = mongoose.model("Like", likeSchema)