//require modules
const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    //define comment
    comment: {
        type: String,
        required: true,
    },
    //define post ID
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference the Post model
        required: true,
    },
    //define commentor
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference user model
        required: true,
    },
    //define creation date
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Comment", CommentSchema, "Comments")