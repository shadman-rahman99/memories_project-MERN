// Initializing every action type for dispatch as a const variable rather
// than string because misspelling string will not always be specifically 
// mentioned in our console but even if we misspell variables it will be
//  accurately shown on console. 
import { FETCH_ALL, FETCH_BY_SEARCH, FETCH_POST, COMMENT, START_LOADING, END_LOADING, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes'
// importing everything from api folder's index.js (by default system chooses
// index.js if any js file not mentioned).
import * as api from '../api'

// Getting single post when click on a memory card from the posts page
export const getPost = (id) => async (dispatch)=> {
    try{
        dispatch({ type: START_LOADING })
        // destructuring the data getting from api.fetchPosts() in { data } 
        // At the same time api.fetchPosts() already executes the database function.
        const { data } = await api.fetchPost(id)
        // console.log(data);
        // Assumption- Calling dispatch() and sending the data fetched from the backend to the 
        // reducer( reducer-> post.js). Then receiving all the data in Post.js using useSelector
        //  from the reducer to print them.
        dispatch({type: FETCH_POST, payload: data})
        dispatch({ type: END_LOADING })
    }catch(error){
        console.log(error);
    }
}

export const getPosts = (page) => async (dispatch)=> {
    try{
        dispatch({ type: START_LOADING })
        // destructuring the data getting from api.fetchPosts() in { data } 
        // At the same time api.fetchPosts() already executes the database function.
        const { data } = await api.fetchPosts(page)
        // console.log(data);
        // Assumption- Calling dispatch() and sending the data fetched from the backend to the 
        // reducer( reducer-> post.js). Then receiving all the data in Post.js using useSelector
        //  from the reducer to print them.
        dispatch({type: FETCH_ALL, payload: data})
        dispatch({ type: END_LOADING })
    }catch(error){
        console.log(error);
    }
}
export const getPostsBySearch = (searchQuery) => async(dispatch)=> {
    try{
        dispatch({ type: START_LOADING })
        // destructuring data twice because posts were sent as a mapped object named data.
        // refer to the line req.json({ data: posts }) in controller->post.js->getPostsBySearch(). 
        // Wherease in almost a similar type of func getPosts() in in controller->post.js we're
        // sending posts as res.status(200).json(postMessages). Which is not a mapped object.  
        const { data: {data} } = await api.fetchPostsBySearch(searchQuery);
        console.log(data);
        dispatch({ type: FETCH_BY_SEARCH, payload: data})
        dispatch({ type: END_LOADING })
    }catch(error){
        console.log(error);
    }
}
export const createPost = (post)=> async(dispatch)=> {
    try{
        dispatch({ type: START_LOADING })
        const {data} = await api.createPost(post)
        dispatch({type: CREATE, payload: data})
        dispatch({ type: END_LOADING })
    }catch(error){
        console.log(error);
    }
}

export const updatePost = (id, post)=> async(dispatch)=>{
     try{
        const {data} =  api.updatePost(id, post) 
        dispatch({ type: UPDATE, payload: data })
     }catch(error){
         console.log(error);
     }
}

export const deletePost = (id) => async(dispatch)=> {
    try{
        api.deletePost(id)
        dispatch({ type:DELETE, payload: id })
    }catch(error){
        console.log(error);
    }
}

export const likePost = (id)=> async(dispatch)=>{
    try{
        // console.log("\nPost-ID-Client:",id);
        const {data} =  api.likePost(id) 
        dispatch({ type: LIKE, payload: data })
     }catch(error){
         console.log(error);
     }
}

export const commentPost = (finalComment, post_id)=> async(dispatch)=>{
    try {
        const { data } = api.comment(finalComment, post_id)
        dispatch({ type:COMMENT, payload:data  })
        return data.comments
    } catch (error) {
        console.log(error)
    }
}
