//Create a connection to the database

const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI //use MONGO_URI environment variable
        )
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1) //exit if there is an error
    }
}

module.exports = connectDB