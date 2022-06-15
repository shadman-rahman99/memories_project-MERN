import React, { useState, useEffect } from 'react'
import FileBase from 'react-file-base64'
import { TextField, Button, Typography, Paper} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, updatePost } from '../../actions/post'
import makeStyles from './style'


function Form({ currentId, setCurrentId, setPostCreation }) {
    const classes = makeStyles()
    const dispatch = useDispatch()
    const [postData, setPostData] = useState({
        title: '', message: '', tags: '', selectedFile: ''
    })
    const post = useSelector((state)=> currentId ? state.posts.posts.find((p)=> p._id === currentId) : null)
    const user = JSON.parse(localStorage.getItem('profile'))

    useEffect(() => {
        if(post) setPostData(post)
        // running this useEffect whenever post variable changes. Initially 
        // its null but when user clicks update button we call setCurrentId()
        // function in Post.js which sets a value for variable currentId.
        // Finally post variable contains data which triggers this useEffect.
        // postData is all set and the Form fills up with the existing post's data. 
    }, [post])

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(currentId){
            // console.log({currentId, postData, name: user?.result?.name});return
            dispatch(updatePost(currentId, {postData, name: user?.result?.name}))
        }else{
            dispatch(createPost({...postData, name: user?.result?.name}))
            setPostCreation(true)   
        }
        clear()
    }
    const clear= ()=> {
        setCurrentId(null)
        // setting all postData value to empty string
        setPostData({ title: '', message: '', tags: '', selectedFile: ''})
    }
    // If user isnt logged display a card rather than the form asking for logging in
    if(!user?.result?.name){
        return (
            <Paper className={classes.paper}>
                <Typography variant='h6' align='center'>
                    Please Log in to create and like memories
                </Typography>
            </Paper>
        )
    }
    // If user is logged in display the form to create post
    return (
        <Paper className={classes.paper} elevation={6} >
            <form autoComplete='off'noValidate className={classes.root,classes.form}
                onSubmit={handleSubmit}>

            <Typography variant="h6">{ currentId? `Editing`: `Creating`} a Memory</Typography>

            {/* <TextField name='creator' variant='outlined' label='Creator'
             fullWidth value={postData.creator} 
             onChange={(e)=> setPostData({...postData, creator: e.target.value})}>
            </TextField> */}

            <TextField name='title' variant='outlined' label='Title'
             fullWidth value={postData.title} 
             onChange={(e)=> setPostData({...postData, title: e.target.value})}>
            </TextField>

            <TextField name='message' variant='outlined' label='Message'
             fullWidth value={postData.message} 
             onChange={(e)=> setPostData({...postData, message: e.target.value})}>
            </TextField>

            <TextField name='tags' variant='outlined' label='Tags'
             fullWidth value={postData.tags} 
             onChange={(e)=> setPostData({...postData, tags: e.target.value.split(',')})}>
            </TextField>

            <div className={classes.fileInput}>
                <FileBase type="file" multiple={false} onDone={
                    (base64)=> setPostData({...postData, selectedFile:base64.base64})}/>
            </div>

            <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>Submit</Button>
            <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    )
}

export default Form
