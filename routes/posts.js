//require modules
const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer"); //multer
const postsController = require('../controllers/posts') //posts controller
const {ensureAuth} = require('../middleware/auth')


//@desc create a post
//@Router POST /posts/createPost
router.post('/createPost', ensureAuth,  upload.single("file"), postsController.createPost)

//@desc get a single post
//@Router GET /posts/getPost
router.get('/:id', ensureAuth, postsController.getPost)

//@desc delete a post
//@Router DELETE /:id
router.delete('/delete/:id', ensureAuth, postsController.deletePost)

//@desc like a post
//@Router PUT likePost/:id
router.put("/likePost/:id", ensureAuth, postsController.likePost)

//@desc get a user's profile
//@Router GET /user/:userId
router.get('/user/:userId', ensureAuth, postsController.getUserProfile)

module.exports = router;