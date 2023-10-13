//User Schema with password hashing

//require modules
const bcrypt = require('bcrypt'); //for password hashing
const mongoose = require('mongoose');

//create mongoose schema

const UserSchema = new mongoose.Schema({
    //define unqiue username
    userName: {
        type: String,
        unique: true,
        required: true,
    },
    //define unique email address
    email: {
        type: String,
        unique: true,
        required: true,
    },
    //define password
    password: {
        type: String,
        required: true,
    },
    //define Image URL
    image: {
        type: [String],
        require: true,
    },
    //define Cloudinary ID
    cloudinaryId: {
        type: [String],
    },
})

//password hash middleware
UserSchema.pre('save', function save(next) {
    const user = this
    if(!user.isModified('password')) {
        return next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err) { return next(err) }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {return next (err) }
            user.password = hash
            next()
        })
    })
})

//Helper method for validating user's password
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

//export using the Userschema called user
module.exports = mongoose.model('User', UserSchema, 'Users')