import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Pagination, PaginationItem } from '@material-ui/lab'
import makeStyles from './paginationStyle'
import { getPosts } from '../actions/post'

//Exporting Paginate as a component
const Paginate =({ page }) => {
    const dispatch = useDispatch()
    const { numberOfPages } = useSelector(state => state.posts)
    // useSelector(state => console.log(state))
    const classes = makeStyles()

    useEffect(() => {
        if(page) dispatch(getPosts(page))
    }, [page])

    return (
        <Pagination
            classes={{ul:classes.ul}}
            count={numberOfPages}
            page={ Number(page) || 1 }
            variant='outlined'
            color='primary'
            renderItem={(item)=> (
                <PaginationItem
                    {...item} component={Link} to={`/posts?page=${item.page}`}
                />
            )}
        />
    )
}
export default Paginate