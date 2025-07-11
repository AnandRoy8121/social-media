import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";

import Post from '../models/post.model.js';
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Comment from '../models/comment.model.js'
import cloudinary from "../config/cloudinary.js";


export const getPosts = asyncHandler(async(req,res)=>{

    const posts = await Post.find()
    .sort({createdAt:-1})
    .populate('user','userName firstName,lastName profilePicture')
    .populate({
        path:'comments',
        populate:{
            path:'user',
            select:'userName firstName lastName profilePicture'
        }
    });

    res.status(200).json({posts});
})

export const getPost = asyncHandler(async(req,res)=>{
    const {postId} = req.params;
    const post = await Post.findById(postId)
    .populate('user','userName firstName lastName profilePicture')
    .populate({
        path:'comments',
        populate:{
            path:'user',
            select:'userName firstName lastName profilePicture'
        }
    });
    
    if(!post) return res.status(404).json({message:"Post not found"})
    
    res.status(200).json({post})
})

export const getUserPosts = asyncHandler(async(req,res)=>{
    const {username} = req.params;

    const user = await User.findOne({userName:username});

    if(!user) return res.status(404).json({error:"User not found"});

    const posts = await Post.find({user:user._id})
    .populate('user','userName firstName lastName profilePicture')
    .populate(
        {
            path:'comments',
            populate:{
                path:'user',
                select:'userName firstName lastName profilePicture'
            }
        }
    )
})

export const likePost = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req)
    const {postId} = req.params;

    const user  = await User.findOne({clerkId:userId})
    const post = await Post.findById(postId);

    if(!userId || !post) return res.status(404).json({message:'User or post not found'});

    const isLiked = post.likes.includes(user._id);

    if(isLiked){
        await Post.findByIdAndUpdate(postId,{ $pull:{ likes: user._id } })
    }else{
        await Post.findByIdAndUpdate(postId,{ $push:{ likes: user._id } })
    }

    if(post.user.toString() !== user._id.toString()){
        await Notification.create({
            from:user._id,
            to:post.user,
            type:'like',
            post:postId
        })
    }
    res.status(200).
    json({message:isLiked? 'Post unliked sucessfully':'Post liked sucessfully'})
})

export const createPost = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req)
    const {content} = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const imageFile = req.file;

    if(!content || !imageFile){
        res.status(400).
        json({message:'Please provide content or an image'})
    }

    let imageUrl = '';
    if(imageFile){
        
        try {
            const base64Image = `data:${imageFile.mimetype};base64,${
            imageFile.buffer.toString('base64')
        }`;

        const uploadResponse = await cloudinary.uploader.upload(
            base64Image,{
                folder:'social_media_post',
                resource_type:'image',
                transformation:[
                    {
                        width:800,height:600, crop:"limit"
                    },
                    {
                        quality:'auto'
                    },
                    {
                        format:'auto'
                    }
                ]
            }
        );
        imageUrl = uploadResponse.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", uploadError);
            return res.status(500).json({ error: "Failed to upload image" });
        }
    }

    const post = await Post.create({
        user: user._id,
        content:content || "",
        image:imageUrl || ""
    });

    res.status(200).json({post})
})

export const deletePost = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req);
    const {postId}  = req.params

    const user = await User.findOne({clerkId:userId})
    const post = await Post.findById(postId);

    if(!user || !post) return res.status(404).json({error:'User or Post not fiund'});
    if(user._id.toString() !== post.user.toString()) return res.status(400).json({error:'User can only delete post created by user'});

    await Comment.deleteMany({post:postId})
    await Post.findByIdAndDelete(postId)

    res.status(200).json({message:'Post deleted successfully.'})
})