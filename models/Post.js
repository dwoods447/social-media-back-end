
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const PostSchema = new Schema({
    text: {
        type: String,
        required: 'Name is required' 
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
    created: { type: Date, default: Date.now },
    likes: [{
        type: mongoose.Schema.ObjectId, ref: 'User',
        date: { type: Date}
      }],
    comments: [{
        text: String,
        commentId: {type: mongoose.Schema.ObjectId},
        created: { type: Date, default: Date.now },
        postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
    }]
})


PostSchema.methods.addCommentToPost = function(commenter, comment){
    let today = new Date();
    const comments = [...this.comments]; 
    comments.push({
        text: comment,
        commentId: mongoose.Types.ObjectId(),
        postedBy: commenter._id,
        created: today,
    })

    this.comments = comments;
    return this.save();
},

PostSchema.methods.addLikeToPost = function(liker){
    const likerIndex = this.likes.findIndex(postLiker => {
        return liker._id.toString() ===  postLiker._id.toString();
        console.log(`Comparing Like index: ${liker._id.toString()} and ${postLiker._id.toString()}`);
    });
    console.log(`Like index returned from array: ${likerIndex}`);
    const updatedLikes = [...this.likes];
    let today = new Date();
    if(likerIndex === -1){
             // If  this user hasn't lied the post add them to liker array
            updatedLikes.push({
            _id: liker._id,
            date: today,
        })
    }
    this.likes = updatedLikes;
    return this.save();
},

module.exports = mongoose.model('Post', PostSchema);