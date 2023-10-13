//require modules
const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    //define comment
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference the Post model
        required: true,
    },
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference user model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Comment", CommentSchema, "Comments")