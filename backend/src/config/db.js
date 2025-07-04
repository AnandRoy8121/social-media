import mongoose from 'mongoose'

import {ENV} from './env.js'

export const connectDB = async()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log('Connected to Database🟢')
        
    } catch (error) {
        console.log("Error Connecting to DB")
        process.exit(1)
    }
}