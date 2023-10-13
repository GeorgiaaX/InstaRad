//require modules
const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer"); //multer
const homeController = require('../controllers/home') //home controllers
const authController = require('../controllers/auth') //auth controllers
const postsController = require('../controllers/posts') //posts controllers
const { ensureGuest, ensureAuth } = require('../middleware/auth') //middleware for authentication


//@desc display Login page as landing Page
//@router GET /
router.get("/", homeController.getLogin);

//@desc login existing user with Login Page
//@router POST /login
router.post("/login", authController.postLogin)

//@desc display SignUp Page
//@Router GET /signUp
router.get("/signUp", authController.getSignUp)

//@desc Create new user with signup
//@Router POST /signup
router.post("/signUp", upload.single("file"), authController.postSignUp)

//@desc display profile page
//@Router GET /profile
router.get('/profile', ensureAuth, postsController.getProfile)

//@desc logout user
//@Router /logout
router.get('/logout', authController.getLogout)

//@desc display the feed
//@Router /feed
router.get('/feed', postsController.getFeedPosts)

module.exports = router;