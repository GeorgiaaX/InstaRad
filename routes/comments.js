//require modules
const express = require('express');
const router = express.Router()
const commentsController = require('../controllers/comments')//comments controller
const { ensureGuest, ensureAuth } = require('../middleware/auth') //middleware for authentication


//@desc post a comment 
//@Router /createComment/:id
router.post('/', ensureGuest, commentsController.createComment)


module.exports = router;