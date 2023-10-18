//require modules
const Comment = require('../models/Comments')//Comments Schema

module.exports = {
    //create comment using schema
    createComment: async (req, res) => {
        try {
            await Comment.create({
            comment: req.body.comment,
            postId: req.body.postId,
            commentor: req.user.id,
            })
            //redirect to the commented post
            res.redirect(`/posts/${req.body.postId}`) 
        } catch (err) {
            console.error(err)
        }
    }
}