import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Typography, TextField, Button } from '@material-ui/core'
import { commentPost } from '../../actions/post'

import makeStyles from './style'

const CommentSection = ({ post })=> {

    // comments stores all the comments fetched from the collection to display.
    const [comments, setComments] = useState(post?.comments) 
    // comment stores string values when a user is currently typing a new comment.  
    const [comment, setComment] = useState('')
    const commentsRef = useRef()
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))
    const classes = makeStyles()
    
    const handleClick = async()=> {
        const finalComment = `${user.result.name}: ${comment}`
        // commentPost() returns all the comments including the newly created one. 
        // ! Since newly posted comment isnt uploading real-time make sure to add
        // ! async after handleClick when working on this issue.
        // const newComments = await dispatch(commentPost(finalComment, post._id))
        dispatch(commentPost(finalComment, post?._id))
        setComment('')
        // setComments(commentedPost)
        window.location.reload()
        // ! enable the code below when comments upload real-time
        // commentsRef.current.scrollIntoView({behavior: 'smooth'})
    }

    return (
        <div>
        <div className={classes.commentsOuterContainer}>
          <div className={classes.commentsInnerContainer}>
            <Typography gutterBottom variant="h6">Comments</Typography>
            {comments?.map((c, i) => (
              <Typography key={i} gutterBottom variant="subtitle1">
                <strong>{c.split(': ')[0]} :</strong>
                {c.split(':')[1]}
              </Typography>
            ))}
            <div ref={commentsRef} />
          </div>
        {(user?.result?.name) && (
              <div style={{ width: '70%' }}>
              <Typography gutterBottom variant="h6">Write a comment</Typography>
              <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
              <br />
              <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} color="primary" variant="contained" 
                onClick = {()=>{
                    handleClick()
                }}>
                Comment
              </Button>
            </div>
        )}
        </div>
      </div>
    );
}
export default CommentSection