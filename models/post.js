const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    description:{
        type: String,
        require: true,
        trim: true
    },
    content: {
        text: {type: String},
        image: {type: String}
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true   
})

const Post = mongoose.model('Post',postSchema)

module.exports = Post