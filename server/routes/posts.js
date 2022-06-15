import express from 'express'

import { getPost, getPosts, getPostsBySearch, commentPost, createPosts, updatePost, deletePost, likePost } from '../controllers/posts.js'
import auth from '../middleware/auth.js'

// Sort the restful APIs from each type(e.g. get,post) in descending order based on their URL length.
// For e.g. get('/search',getPostsBySearch) should come before get('/:id', getPost). Otherwise
// when manually searching post with a url, for e.g. 
// http://localhost:3000/posts/search?searchQuery=none&tags=javascript, router will route to  
// get('/:id', getPost) considering the term search from the url as the id since search is 
// right after '/posts'.
const router = express.Router()
router.get('/search',getPostsBySearch)
router.get('/:id', getPost)
router.get('/', getPosts)

router.post('/:post_id/commentPost',auth, commentPost)
router.post('/', auth, createPosts)

router.patch('/:id/likePost',auth, likePost)
router.patch('/:id',auth, updatePost)

router.delete('/:id',auth, deletePost)

export default router;