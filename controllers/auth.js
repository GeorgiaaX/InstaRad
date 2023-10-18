const User = require("../models/User")
const validator = require('validator') //validation library
const cloudinary = require("../middleware/cloudinary"); //require cloudinary
const passport = require("passport");

module.exports = {
    //post login form
    postLogin: async (req, res, next) => {
        //store Validation messages in an array
        const validationErrors = [];
        
        //Normalise email address
        req.body.email = validator.normalizeEmail(req.body.email, {
            gmail_remove_dots: false,
        });

        //Authenticate user using Passport's local strategy
        passport.authenticate("local", (err, user) => {
            if (err) {
                //if error return next route handler
              return next(err);
            }
            if (!user) {
                //push error message to validation array
                validationErrors.push({ msg: 'Invalid Username or Password'})

                //Render the login template with validation errors
                return res.render('login', {
                    layout: 'landing',
                    validationErrors,
                })
            }

            //If auth succeeds, log in user
            req.logIn(user, (err) => {
              if (err) {
                return next(err);
              }
              //redirect to feed
              res.redirect(req.session.returnTo || "/feed");
            });
          })(req, res, next);
    },
    //get the signin page
    getSignUp: (req, res) => {
        //if user is logged in, redirect to feed
        if(req.user) {
            return res.redirect('/feed')
        }
        //render signup page
        res.render(
            'signUp',
            {
                layout: 'landing'
            }
        )
    },
    //post sign up form
    postSignUp: async (req, res, next) => {
        // Store validation errors in an array
        const validationErrors = [];
    
        // Validation checks, push error messages to validationErrors array
        if (!validator.isEmail(req.body.email)) {
            validationErrors.push({ msg: 'Please enter a valid email address.' });
        }
        if (!validator.isLength(req.body.password, { min: 8 })) {
            validationErrors.push({ msg: 'Password must be at least 8 characters long' });
        }
        if (req.body.password !== req.body.confirmPassword) {
            validationErrors.push({ msg: 'Passwords do not match' });
        }
    
        // Add validation for the image upload
        if (!req.file) {
            validationErrors.push({ msg: 'Please upload an image.' });
        }
    
        if (validationErrors.length > 0) {
            // Pass validationErrors to the template
            return res.render('signUp', { layout: 'landing', validationErrors });
        }
    
        // Normalize the email address, remove dots from Gmail address
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
    
        // Create a new user instance with the submitted data using the mongoose user schema
        try {
            // Check for an existing user in the database
            const existingUser = await User.findOne({
                $or: [{ email: req.body.email.toLowerCase() }, { userName: req.body.userName }],
            });
    
            if (existingUser) {
                // Push an error message to validationErrors array if the user already exists
                validationErrors.push({ msg: 'An account with that email address or username already exists. Please proceed to Login.' });
                return res.render('signUp', { layout: 'landing', validationErrors });
            }
    
            // If there's no existing user, create a new User using the User model
            const result = await cloudinary.uploader.upload(req.file.path);
            const user = new User({
                userName: req.body.userName,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                image: result.secure_url,
                cloudinaryId: result.public_id, // Store the Cloudinary public ID
            });
    
            // Save the user to the database
            await user.save();
    
            // Log in the user
            req.logIn(user, (err) => {
                if (err) {
                    throw err; 
                }
                //redirct to the feed
                res.redirect('/feed');
            });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    },
    //log user out and destroy session
    getLogout: (req, res, next) => {
        //call the logout method provided by passport.js to logout the user
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            //destroy the user session
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error: Failed to destroy the session during logout.', err);
                }
                //set the user property to null to indicate the user is no longer authenticated
                req.user = null;
                //redirect to landing page after logout
                res.redirect('/');
            });
        });
    }
}