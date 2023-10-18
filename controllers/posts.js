//require modules
const Post = require('../models/Posts') //Post schema
const User = require('../models/User') // User schema
const cloudinary = require("../middleware/cloudinary"); //require cloudinary
const upload = require("../middleware/multer");
const Comments = require('../models/Comments');
const { errorMonitor } = require('connect-mongo');
const validator = require('validator') //validation library



module.exports = {
    //get profile page
    getProfile: async (req, res) => {
        try {
            //find user by Id
            const user = await User.findById({ _id: req.user.id })
            //find posts by user
            const posts = await Post.find(
                {
                    creator: req.user.id
                })
                .lean()

                //count posts
            const countPosts = posts.length
                
            //render profile
            res.render("profile", 
            {
                posts,
                countPosts,
                userName: user.userName,
                bio: user.bio,
                profile: user.image
            }

            )
        } catch(err) {
            console.error(err)
        }
    }, 
    //create new post
    createPost: async (req, res) => {
        // Store validation errors in an array
        const validationErrors = [];
    
        // Add validation for the image upload
        if (!req.file) {
            validationErrors.push({ msg: 'Please upload an image.' });
        }
    
        // Add validation for the caption
        if (!req.body.caption || req.body.caption.trim() === '') {
            validationErrors.push({ msg: 'Please provide a caption for your post.' });
        }
    
        if (validationErrors.length > 0) {
            // Pass validationErrors to the template
            return res.redirect('/feed');
        }
        
        try {
            //store cloudinary URL
            const result = await cloudinary.uploader.upload(req.file.path);
            //create new post
            await Post.create({
                title: req.body.title,
                image: result.secure_url,
                cloudinaryId: result.public_id, // Store the Cloudinary public ID
                caption: req.body.caption,
                creator: req.user.id
            });
            //redirect to feed
            res.redirect('/feed');
        } catch (err) {
            console.error(err);
        }
    },
    //get all feed posts
    getFeedPosts: async (req, res) => {
        try {
            // Fetch 10 random users
        const randomUsers = await User.aggregate([
            { $sample: { size: 10 } } // Get 10 random users
        ]);
            //find all posts
            const posts = await Post.find()
            .populate('creator')
            //sort descending
            .sort({createdAt: 'desc'})
            .lean()
            //render feed
            res.render('feed', {
                posts,
                users: randomUsers,
            })
        } catch (err) {
            console.error(err)
        }
    },
    //delete posts
    deletePost: async (req, res) => {
        try {
            //find post by Id and delete
            let post = await Post.findByIdAndDelete({ _id: req.params.id })
            await Comments.deleteMany({postId: req.params.id})
            //delete from cloudinary
            await cloudinary.uploader.destroy(post.cloudinaryId)
            console.log("deleted post")
            //redirect to user profile
            res.redirect('/profile')
        } catch (err) {
            console.error(err)
        }
    },
    //get single post
    getPost: async (req, res) => {
        try {
            // Find comments associated with the specified post ID and populate 'commentor'
            const loggedUser = req.user
            //find all comments on post
            const comments = await Comments.find({ postId: req.params.id })
                .populate('commentor')
                .lean();
            // Find the post by its ID and populate 'creator'
            const post = await Post.findById(req.params.id)
                .populate('creator')
                .lean();
    
            // Render the 'post' template with the comments and post data
            res.render('post', { comments, post, loggedUser});
        } catch (err) {
            console.error(err);
        }
    },
    //like a post
    likePost: async (req, res) => {
       try {
            //find the post id and update likes
            await Post.findOneAndUpdate({ _id: req.params.id }, 
                {
                    //increment likes by 1
                    $inc: { likes: 1},
                }
            )
            console.log("likes + 1")
            //redirect to post
            res.redirect(`/posts/${req.params.id}`);
       } catch(err) {
            console.error(err)
       }
    },
    //get User profile
    getUserProfile: async(req,res) => {
        try {
            // Find the user by their user ID (from the route parameter)
            const user = await User.findById(req.params.userId);
           
            if (!user) {
                // Handle the case where the user with the specified ID is not found
                return res.status(404);
            }
            //find all user posts
            const posts = await Post.find({
                creator : req.params.userId, // User ID is obtained from the route parameter
            })
            //sort by descending order
            .sort({ createdAt: 'desc' }) 
            .lean(); 
            //count number of posts
            const countPosts = posts.length
            //render the user profile page
            res.render('userProfile', {
                profileId: req.params.userId,
                userName: user.userName,
                profile: user.image,
                posts,
                countPosts
            });
           } catch (err) {
            console.error(err);
           }
    },
}








 
