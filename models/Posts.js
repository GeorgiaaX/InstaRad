//require modules
const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    //define creator id
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference user model
        required: true,
    },
    //define Image URL
    image: {
        type: [String],
        required: true,
    },
    //define Cloudinary ID
    cloudinaryId: {
        type: [String],
        required: true,
      },
    //define text content
    caption: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // set date to current date
    },
    //define likes
    likes: {
        type: Number,
        default: 0
    }
    
})

module.exports = mongoose.model('Post', PostSchema, "Posts")