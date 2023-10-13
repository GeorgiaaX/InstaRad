//require modules
const Comment = require('../models/Comments')//Comments Schema

module.exports = {
    createComment: async (req, res) => {
        try {
            await Comment.create({
            comment: req.body.comment,
            postId: req.body.postId,
            commentor: req.user.id,
            })
            res.redirect(`/posts/${req.body.postId}`) 
        } catch (err) {
            console.error(err)
        }
    }
}