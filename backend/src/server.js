import express from 'express';
import cors from 'cors';
import {clerkMiddleware} from '@clerk/express'

import {ENV} from './config/env.js'
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/',(req,res)=>{
    res.send('Response from the server')
})

// user routes
app.use('/api/users', userRoutes);
// post routes
app.use('/api/posts', postRoutes);
// comment routes
app.use('/api/comments',commentRoutes);

const startServer = async()=>{

    try {
        await connectDB();
        
        app.listen(ENV.PORT, ()=>console.log(`Server is running on port ${ENV.PORT}`));
    } catch (error) {
        console.error('Server Failed to start:', error.message);
        process.exit(1);
    }

}

startServer()

