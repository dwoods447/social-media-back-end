
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const moment = require('moment');
const config = require('../config/config');
const path = require('path');
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    username: {
        type: String,
        required: 'username is required',
    },
    password: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], 
        unique: 'Email already exists'
    },
    about: {
        type: String,
        trim: true
    },
    onlineStatus: {
        type: Boolean,
    },

    followers: {
        users: [
            {
                userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
            }
        ]
    },
    following: {
        users: [
            {
                userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
            }
        ]
    },

    images: {
        imagePaths: [
            {   
                imageId: {type: Schema.Types.ObjectId},
                path: { type: String, required: true},
                date: {type: Date}
            }
        ],
    },
    created: {  type: Date,  default: Date.now }, 
    updated: Date,

})



UserSchema.methods.addImageToProfile = function(imagePath){
    let fullPath = '';
    let port = config.port.toString();
    let host = config.host+':'+port;
    
    fullPath = path.join(host, imagePath);
    fullPath = "http://"+fullPath;
    const updatedImages = [...this.images.imagePaths];
    if(updatedImages.length <= 4){
        updatedImages.push({
            imageId: mongoose.Types.ObjectId(),
            path: fullPath,
            date: new Date(),
        }) 
    } else {
        // Only 4 images are allowed.
        return false;
    }
    
    this.images.imagePaths = updatedImages;
    return this.save();
}

UserSchema.methods.removeImageFromProfile = function(imageId){
   
    const targetImg = this.images.imagePaths.find(target =>{
        return target.imageId.toString() === imageId;
      })
       const imgPth = path.join(__dirname + '/./../../static/uploads/', targetImg.path);
       try{
         fs.unlinkSync(imgPth);
       } catch(err){
         console.error(`Error deleting file: ${err}`);
       }
  
      const userImages = this.images.imagePaths.filter(image =>{
          return image.imageId.toString() !== imageId;
      })
      this.images.imagePaths = userImages;
      return this.save();
}


UserSchema.methods.addToFollower = function(userID){
    const followerIndex = this.followers.users.findIndex(follower => {
        return userID === follower.userId.toString();
    });

    const updatedFollowers = [...this.followers.users];

    if(followerIndex ===  -1){
         // User is not in block user list add them
         updatedFollowers.push({
            userId: mongoose.Types.ObjectId(userID),
        })
    }  else {
            // User is already in follower list DONT add them
            return;
    }

    const newFollowers = {
        users:  updatedFollowers
    }
    this.followers  =  newFollowers;
    return this.save();
}

UserSchema.methods.addToFollowing = function(userID){
    const followerIndex = this.following.users.findIndex(follower => {
        return userID === follower.userId.toString();
    });

    const updatedFollowing = [...this.following.users];

    if(followerIndex ===  -1){
         // User is not in block user list add them
         updatedFollowing.push({
            userId: mongoose.Types.ObjectId(userID),
        })
    }  else {
            // User is already in follower list DONT add them
            return;
    }

    const newFollowing = {
        users:  updatedFollowing
    }
    this.following  =  newFollowing;
    return this.save();
}


module.exports = mongoose.model('User', UserSchema);