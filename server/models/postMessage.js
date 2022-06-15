import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    // tags is an array of string
    tags: [String],
    selectedFile : String,
    likes: {
        // likes will have array of string which will consist of user's Id.
        // initially it will be an empty array. 
        type: [String],
        default: [],
    },
    comments:{
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

const PostMessage  = mongoose.model('PostMessage', postSchema) 
export default PostMessage