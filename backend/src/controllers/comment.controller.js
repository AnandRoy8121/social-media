import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";


export const getComments = asyncHandler(async(req,res)=>{
    const {postId} = req.params;

    const post = await Post.findById(postId);

    if(!post) return res.status(404).json({error:'Post not found'});

    const comments = await Comment.find({post:postId})
    .sort({createdAt:-1})
    .populate('user','userName, firstName, lastName, profilePicture ');

    res.status(200).json({comments})
});

export const createComment = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req)
    const {postId} = req.params;
    const {content}  = req.body;

    if(!content || !content.trim() ==""){
        return res.status(400).json({error:'Comment content is required'});
    }

    const post = await Post.findById(postId);
    const user = await User.findOne({clerkId:userId});

    if(!post || user) return res.status(404).json({error:'Post or User not found'});

    const comment = await Comment.create({
        user:user._id, 
        post:postId, 
        content
    })

    await Post.findByIdAndUpdate(postId,{
        $push:{comments:comment._id},
    })

    if(post.user.toString()!== user._id.toString()){
        await Notification.create({
            from:user._id,
            to:post.user,
            type:'comment',
            post:postId,
            comment:comment._id
        })
    };

    res.status(201).json({message:'Comment created successfully'})

})

export const deleteComment = asyncHandler(async(req,res)=>{

    const {commentId} = req.params;
    const {userId} = getAuth(req);

    const comment = await Comment.findById(commentId);
    const user = await User.findOne({clerkId:userId});

    if(!comment || !user) return res.status(404).json({error:'User or Post not found'})
    
    if(comment.user.toString() !== user._id.toString()){
        return res.status(400).json({error:'User can only delete their own comments'})
    }

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post,{
        $pull:{comments:commentId}
    });
    res.status(200).json({message:'Comment deleted successfully'});
})