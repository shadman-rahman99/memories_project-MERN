import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'
import express from 'express'
const app = express()

export const getPost = async(req,res)=>{
    const {id} = req.params 
    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
    } catch (error) {
        console.log("controller->posts.js->getPost() : ",error);
        res.status(404).json({message: error})
    }
}

export const getPosts = async(req,res )=>{
    // console.log(req.query);
    const { page } = req.query
    // console.log(page);
    try{
        const LIMIT = 3
        // converting string var page to number
        const startIndex = (Number(page)-1) * LIMIT
        const total = await PostMessage.countDocuments({})
        // sort({_id: -1}) is getting us latest post first. limit(LIMIT) is limiting the number of
        // posts fetching. skip(startIndex) is going to skip posts based on startIndex. For e.g. 
        // if startIndex=8 we will skip the first 8 posts from the collection so we dont end up
        // fetching all 16 posts when we are in page 2.
        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex)
        res.status(200).json({ data: posts, currentPage:Number(page), numberOfPages: Math.ceil(total/LIMIT) })
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const getPostsBySearch = async(req,res)=> {
    // Refer to index.js in api folder, we are passing 2 queries through our URL. Each query is
    // seperated by an '&'. So storing each query seperately in the variables below.
    const { searchQuery, tags } = req.query
    try{
        // converting searchQuery into a regular expression. Using a flag of 'i', which means
        // if we are passing a query of String such as TEST,test,Test they are all gonna be same
        // becasue its not case-sensitive. So TEST, test, Test -> test
        const title = new RegExp(searchQuery, 'i')
        // $or is used to find a post where either the title or the tags matches. Since tags is an
        // array, we're using $in:tags.split(',') in order to split everything after every comma ','
        //  inside the tags variable and find if there's any element from our tags var similar to 
        // the elements of the mapped object named tags in the documents of our database collection.
        // For e.g. if there is any post with the title BugFixing, then literally searching 'bu'
        // will fetch me that post.
        const posts = await PostMessage.find({$or: [{ title }, { tags: { $in: tags.split(',')}}]})
        res.json({ data: posts })
    }catch(error){
        res.status(404).json({ message: error})
        console.log("\ncontroller->post.js->getPostsBySearch() ",error);
    }
}
export const createPosts = async (req,res)=>{
    // req.userId is passing in through the middleware
    const newPost = new PostMessage({...req.body, creator:req.userId, createdAt: new Date().toISOString()})
    try{
        await newPost.save()
        res.status(201).json(newPost)
        console.log(`\nPost created at ${new Date()}`);
    }catch(error){
        res.status(409).json({message: error})
    }
    // console.log(nodemon.restart());
}

export const updatePost = async(req,res)=> {
    // for URLs like 'localhost:5000/posts/(any_value)' req.params returns the
    // value from any_value. 
    const { id: _id } = req.params 
    //Checking if there is any post with that id.
    if(!mongoose.Types.ObjectId.isValid(_id)){
        res.status(404).send("controller->post.js->updatePost(): No post with that id found") 
        console.log("\ncontroller->post.js->updatePost(): No post with that id found");
    }else{
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, req.body.postData, {new:true})
        res.json(updatedPost)
        console.log("Post updated");
    }
}

export const deletePost = async(req,res)=> {
    const {id} =req.params 
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).send("controller->post.js->deletePost(): No post with that id found") 
        console.log("\ncontroller->post.js->deletePost(): No post with that id found");
    }else{
        await PostMessage.findByIdAndRemove(id)
        res.json({message:'\nPost deleted.'})
        console.log('\nPost deleted');
    }
}
export const likePost = async(req,res)=> {
    const {id} =req.params 
    console.log('\nreq.userId-controller->post.js:55: ',req.userId);
    // checking userId from middleware's auth()
    if(!req.userId){
        res.json({message:'Unauthenticated-middleware'})
        console.log('\nUnauthenticated access, req.userId is null-controller->post.js:59: ',);
        return
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).send("controller->post.js->likePost(): No post with that id found-middleware") 
        console.log("\ncontroller->post.js->likePost(): No post with that id found-middleware");
        return
    }
    const post = await PostMessage.findById(id)
    // iterating through all the IDs in likes to check if there is any id that matches to
    // req.userId. If it does not it will return -1.  
    const index = post.likes.findIndex((id)=> id === String(req.userId) )
    if(index === -1){
        // since index is -1 we are adding that user's id to add one more like to that post
        post.likes.push(req.userId)
        console.log('\nPost liked successfully');
    }else{
        // retrieving all the IDs where req.userId is not equal to all the IDs in likes.  
        // So the user can dislike a post.
        post.likes = post.likes.filter((id)=> id !== String(req.userId) )
        console.log('\nPost disliked successfully');
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post ,{new:true})
    res.json(updatedPost)
    console.log('likePost func complete');
}

export const commentPost = async(req,res)=> {
    const { post_id } = req.params
    const { finalComment } = req.body
    console.log("commenting...");
    const post = await PostMessage.findById(post_id)
    // console.log(post);return
    post.comments.push(finalComment)
    const updatedPost = await PostMessage.findByIdAndUpdate( post_id, post, {new:true} )
    res.json(updatedPost)
    console.log('\n Comment uploaded');
}