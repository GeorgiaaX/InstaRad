//require modules
const express = require('express');
const router = express.Router()
const commentsController = require('../controllers/comments')//comments controller

//@desc post a comment 
//@Router /createComment/:id
router.post('/', commentsController.createComment)


module.exports = router;