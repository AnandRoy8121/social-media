import express from 'express';
import cors from 'cors';
import {clerkMiddleware} from '@clerk/express'

import {ENV} from './config/env.js'
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/',(req,res)=>{
    res.send('Response from the server')
})

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

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

