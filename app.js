//require modules
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars'); // handlebars
const methodOverride = require('method-override');
const passport = require('passport'); //passport for user auth
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db'); //database connection
const flash = require('express-flash');
const mainRoutes = require('./routes/main') //main routes
const postsRoutes = require('./routes/posts') //posts routes
const commentsRoutes = require('./routes/comments')//comments routes

//load config
dotenv.config({ path: './config/config.env' })

// Passport config
require("./config/passport")(passport);

const app = express()

//connect to database
connectDB()

//helpers
const { formatDate, deleteIcon} = require('./helpers/hbs')

//Set up handlebars templating engine
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        deleteIcon
    },
    defaultLayout: 'main',
    extname: '.hbs',
}))


//set up view engine
app.set('view engine', '.hbs')

//set up static folder
app.use(express.static('public'))

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//use method ovverride to override form methods
app.use(methodOverride (function (req, res) {
    if (req.body && typeof req.body === "object" && '_method' in req.body ) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//Session middleware
app.use(session({
    secret: 'keybord cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set up Routes
app.use('/', mainRoutes); //main routes
app.use('/posts', postsRoutes); //post routes
app.use('/comments', commentsRoutes); //comments routes

//set PORT
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})