import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, Popover, Divider, CardActions,CardContent, CardMedia, Button, Typography} from '@material-ui/core'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment'
import { deletePost, likePost } from '../../../actions/post'
import makeStyles from './style'

function Post({post, setCurrentId }){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [likes, setLikes] = React.useState(post?.likes)
    const user = JSON.parse(localStorage.getItem('profile')) 
    const classes = makeStyles()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // While we dispatch the likePost(), we are immediately displaying the number of likes 
    // on a post when Like button is clicked rather than waiting for the response from 
    // the server and then showing likes count. Often times server may be 
    // slow as a result immediately updating the like counts on the frontend is wiser.
    const handleLike = async()=> {
        dispatch(likePost(post._id))
        // if the logged-in user has previously liked the post then we are filter out 
        // all the likes except his like for that post and calling setLikes. 
        if (likes?.find((like) => like === (user?.result?.googleId || user?.result?._id))) {
            setLikes(likes?.filter((like)=> like !== (user?.result?.googleId || user?.result?._id) ))
        }else{
            // else we add the logged-in user's id to add one more like to the post.
            setLikes([...likes, (user?.result?.googleId || user?.result?._id) ])
        }
    } 
    
    const Likes = () => {
        if (likes.length > 0) {
          return likes?.find((like) => like === (user?.result?.googleId || user?.result?._id))
            ? (
              <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes?.length > 2 ? `You and ${likes?.length - 1} others` : `${likes?.length} like${likes?.length > 1 ? 's' : ''}` }</>
            ) : (
              <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes?.length} {likes?.length === 1 ? 'Like' : 'Likes'}</>
            );
        }
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
      };

      const openPost = ()=> navigate(`/posts/${post._id}`)
      
    return (
        <Card  className={classes.card} raised elevation={6} >
            {/* <ButtonBase className={classes.cardActions} onClick={openPost} >
            </ButtonBase> */}

                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant='h6'>{post.name} </Typography>
                    <Typography variant='body2' > {moment(post.createdAt).fromNow()} </Typography>
                </div>
               
                         {/* <div className={classes.overlay2}>
                         <Button style={{color:"white"}} size='small' 
                        onClick={()=>{
                            setCurrentId(post._id)
                        }}>
                            <MoreHorizIcon fontSize='large' />
                        </Button>
                        </div> */}
                        <div className={classes.overlay2}>
                            <Button style={{color:"white"}} size='small' onClick={handleClick}>
                            <MoreHorizIcon fontSize='large' />
                            </Button>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                                }}
                            >
                               { (user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                                    <Button onClick={(e)=>{
                                        e.stopPropagation()
                                        handleClose()
                                        setCurrentId(post._id)
                                        }}>
                                        <Typography style={{ margin:'3px', padding:'5px' }} sx={{ p: 2 }}>Edit post</Typography>
                                    </Button>
                                )}
                               
                                <Divider/>

                                <Button onClick={()=>{
                                    handleClose()
                                    openPost()
                                    }}>
                                    <Typography style={{ margin:'3px', padding:'5px' }} sx={{ p: 2 }}>View post</Typography>
                                </Button>                                
                            </Popover>
                        </div>
                 
                <div className={classes.details} >
                    <Typography variant='body2' color='textSecondary'> 
                    {post.tags.map(tag =>`#${tag} `)} </Typography>
                </div>
                <Typography className={classes.title} variant='h5' color='textPrimary'> {post.title} </Typography>
                <CardContent>
                <Typography variant='body2' color='textSecondary'> {post.message} </Typography>
                </CardContent>
                <CardActions className={classes.cardAction}>
                    <Button size='small' color='primary' disabled={!user?.result} 
                    onClick={handleLike}>
                        <Likes/>
                    </Button>
                    {
                        (user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                            <Button size='small' color='primary'
                            onClick={()=>{ dispatch(deletePost(post._id)) }} 
                            >
                                <DeleteIcon fontSize='small' />
                                Delete
                            </Button>
                        )
                    }
                </CardActions>
        </Card>
    )
}

export default Post