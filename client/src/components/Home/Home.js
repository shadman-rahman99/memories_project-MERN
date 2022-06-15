import React, { useState ,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'
import Posts from '../Posts/Posts'
import Form from  '../Form/Form'
import Paginate from '../Pagination'
import { getPosts, getPostsBySearch } from '../../actions/post'
import makeStyles from './style'

function useQuery(){
    return new URLSearchParams(useLocation().search)
}

function Home() {
    // currentId is the id of the post selected for updating.
    const [currentId, setCurrentId] = useState(null)
    const [postCreation, setPostCreation] = useState(false)
    const [search, setSearch] = useState('')
    // tags is gonna be empty array because later it will contain multiple tags 
    const [tags, setTags] = useState([])
    const dispatch = useDispatch() 
    const navigate = useNavigate()
    const query = useQuery() 
    // if the URL do not have any param named page then page variable is gonna be 1  
    const page = query.get('page') || 1
    const searchQuery = query.get('searchQuery')
    const classes = makeStyles()

    const handleKeyPress = (e)=> {
        if(e.keyCode === 13){
            searchPost()
        }
    }
    const searchPost = ()=> {
        if(search.trim() || tags ){
            // If tags has an array like [europe, USA], tags.join(',') is gonna return something 
            // like 'europe,Usa' which is a String with all the elements of an array joined together
            // with a comma.
            dispatch(getPostsBySearch({search, tags: tags.join(',')}))
            // passing the variable search if it has value or else passing a string
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
        }else{
            navigate('/')
        }
    }
    const handleAdd = (tag)=> setTags([...tags, tag])
    // Assumption- onDelete property in ChipInput passes the index of the tag to delete and
    // filter func filters out based on that index
    const handleDelete = (tagToDelete)=> setTags(tags.filter((tag)=> tag !== tagToDelete))

    useEffect(() => {
        console.log("Home.js-> Calling getPosts()");
        dispatch(getPosts(page))
        setPostCreation(false)
    }, [ currentId, postCreation==true,dispatch])

    return (
        <Grow in>
        <Container maxWidth='xl'>
            <Grid className={classes.griContainer} container justifyContent='space-between'alignItems='stretch'spacing={3} >
                <Grid item xs={12} sm={6} md={9}>
                    <Posts setCurrentId={setCurrentId} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                        <TextField name='search' variant='outlined' label='Search Memories'
                            fullWidth value={search} onChange={(e)=> setSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <ChipInput style={{margin:'10px 0'}} value={tags} onAdd={handleAdd}
                            onDelete={handleDelete} label='Search Tags' variant='outlined'
                        />
                        <Button onClick={searchPost} className={classes.searchButton} 
                        color='primary' variant='contained'>
                            Search
                        </Button>
                    </AppBar>
                    <Form setPostCreation={setPostCreation} currentId={currentId} setCurrentId={setCurrentId} />
                   {
                       (!searchQuery && !tags.length) && (
                        <Paper elevation={6} className={classes.pagination} >
                            <Paginate page={page} />
                        </Paper>    
                       )
                   }
                </Grid>                   
            </Grid>
        </Container>
    </Grow>
    )

}

export default Home
