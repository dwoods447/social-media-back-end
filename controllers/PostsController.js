const Post = require('../models/Post'); 
const User = require('../models/User');
const { findById } = require('../models/User');
const mongoose = require('mongoose');

module.exports = {
    async getAllPosts(req, res, next){
        console.log('Feteching posts on the server');
        // const posts = await Post.find().populate({path: "postedBy" , select:['username','gender', 'generatedUser', 'images.imagePaths']})
        // .populate({path: "comments", select: ['username','gender', 'generatedUser', 'images.imagePaths']});
        const posts = await Post.find()
        .populate('likes')
        .populate('postedBy')
        .populate('comments.postedBy')
        .sort({'created': -1});
        console.log(`All posts on server: ${JSON.stringify(posts, null, 2)}`);
        return res.json({posts: posts});
    },

    async createPost(req, res, next){
        console.log(`Creating post on the server...`);
        const { text, photo } = req.body;
        console.log(`ID of user that created post: ${req.userId}`)
        const user = await User.findOne({_id: req.userId});
        console.log(`User info: ${JSON.stringify(user._id)}`);
        try {
        let postContents = {};
        if(!user){
            return res.status(401).json({message: 'User not authenticated'})
        }
        if(text){
            postContents.text = text;
        }
        if(photo){
            postContents.photo = photo;
        }
     
        postContents.postedBy = user._id;
        
        
        console.log(`Post Contents, ${JSON.stringify(postContents, null, 2)}`)
      
        const newPost = new Post(postContents);
        const savedPost = await newPost.save();
        }catch(error){
            console.log(error);
        }

        return res.status(200).json({message: 'User post created sucessfully!'})
    },

    async deletePost(req, res, next){
        const user = await User.findById(req.userId); 
        const { postId } = req.body;
        console.log(`Post ID on the server ${postId}`)
        const post = await Post.findOne({_id: postId});
        console.log(`Post found: ${JSON.stringify(post , null, 2)}`);
    },

    async addCommentToPost(req, res, next){
        console.log('User Id ' + JSON.stringify(req.userId))
        const user = await User.findOne({_id: req.userId});
        if(!user){
            return res.status(401).json({message: 'User not Authenticated'});
        }
       // console.log(`User ${JSON.stringify(user)}`);
        const { postId, comment } = req.body;
        console.log(`Post ID on the server ${postId}`);
        console.log(`Comment on the server ${comment}`);
        const post = await Post.findOne({_id: postId});

        // Check for found post

        if(!post){
            return res.status(422).json({message: 'Post not found'});
        }

        //console.log(`Post found: ${JSON.stringify(post, null, 2)}`);
        const commentAdded =  await post.addCommentToPost(user, comment);
       if(!commentAdded){
        return res.status(422).json({message: 'There was an error adding the comment'})
       }
       return res.status(200).json({message: 'Comment added to post sucessfully!'})
    },
    async addLikeToPost(req, res, next){
        const user  = await User.findById(req.userId); 
        if(!user){
            return res.status(401).json({message: 'User not Authenticated'});
        }
        const { postId } = req.body; 
        console.log(`Post Id: ${postId}`);
        const post = await Post.findOne({_id: postId});  
        console.log(`Post found: ${JSON.stringify(post , null, 2)}`);
        if(!post){
            return res.status(422).json({message: 'Post not found'});
        } 
        const likeAdded = await post.addLikeToPost(user);
        if(!likeAdded){
            return res.status(422).json({message: 'There was an error adding the like'})
           }
       return res.status(200).json({message: 'Like added to post sucessfully!'})
    }
}



