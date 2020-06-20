const User = require('../models/User'); 
const moment = require('moment');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { findOne } = require('../models/User');
const secret = config.authentication.jwtSecret;



module.exports = {
    async getSingleUser(req, res, next){
        const user = User.findById()
        .populate('following', '_id name')
        .populate('followers', '_id name');
        return res.json({user: user});
    },

    async getAllUsers(req, res, next){
        const users = [{name: 'Demaria Woods'}, {name: 'Darrell Woods'}];
        return res.json({users: users});
    },

    async updateUser(req, res, next){
        const {username, email, about, password} = req.body;
        let projection = {password: 0, email: 0}
        const user = await User.findOne({_id: req.userId}, projection);
        if(!user){
            return res.status(422).json({message: 'No user found'});
        }
        if(username) user.username = username;
        if(email) user.email = email;
        if(about) user.about = about;
        if(password) user.password = password;
        const savedUser = await user.save();
        if(!savedUser){
            return res.status(422).json({message: 'There was an error saving the profile'});
        }
        return res.status(200).json({message: 'User Profile updated successfully!', user: savedUser });
    },

    async deleteUser(req, res, next){
        return res.json({messagae: 'User deleted'});
    },

    async uploadImage(req, res, next){

        const user = await User.findById(req.userId);
        if(!user){
         return res.status(401).json({message: 'Unauthorized you are not logged in!'});
        }
        if(!req.file){
           const error  = new Error('No image provided');
           return res.status(422).json({message: error});
        }

        let imgLength = user.images.imagePaths.length;
        if(imgLength <= 4){
        // const imageUrl = req.file.path;
         const imageUrl = req.file.filename;
         const imageUploaded = await user.addImageToProfile(imageUrl);
          if(!imageUploaded){
             return res.status(422).json({message: 'There was an error uplaoding your image'});
          }
        } else {
           return res.status(422).json({ message: 'You have exceeded the limit to the number of images you can upload' });
        }
         return res.status(200).json({message: 'Image uploaded successfully', user:user});
      },

      async followUser(req, res, next){
        const currentUser = await User.findById(req.userId);
        if(!currentUser){
            return res.status(401).json({message: 'Unauthorized you are not logged in!'});
         }


         const { userId } = req.body;


         const otherUser = await User.findOne({_id:userId});
        
         // Add the current user to the other user's followers list
         const otherUserFollowed = await otherUser.addToFollower(currentUser);
         //Add the other user to the current user;s follwing list
         const otherUserFollowed = await currentUser.addToFollowing(otherUser);
      },

      async unFollowUser(req, res, next){

      }
}