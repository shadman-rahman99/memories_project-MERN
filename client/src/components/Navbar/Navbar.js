import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import decode from 'jwt-decode'
import { AppBar, Typography,Toolbar, Avatar, Button } from '@material-ui/core'
import makeStyles from './style'
import memories from '../../images/memories.png'
import memories_text from '../../images/memories-Text.png'

function Navbar() {
    const classes = makeStyles()
    const navigate = useNavigate()
    const dispatch = useDispatch() 
    const location = useLocation()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
    // console.log(user);

    const logout = ()=> {
        dispatch({ type: 'LOGOUT' })
        navigate('/auth')
        setUser(null)
    }

    useEffect(() => {
        const token = user?.token
        if(token){
            const decodedToken = decode(token)
            // exp gets the value for time expiry. If condition is true then user session (token)
            // has expired 
            if(decodedToken.exp * 1000 < new Date().getTime()) return logout()
        }
        // JWT
        setUser(JSON.parse(localStorage.getItem('profile')))
        // location variable from useLocation function stores current URL. Whenever data in
        // location changes useEffect will be called.
    }, [location])
    
    return (
        <AppBar className={classes.appBar} position='static' color='inherit'>
            <Link to='/' className={classes.brandContainer}>
                <img src={memories_text} alt='icon' height='45px'/>
                <img  className={classes.image} src={memories} alt='memories' height='60' />
            </Link>
            <Toolbar className={classes.toolbar}>
                {
                    user? (
                        <div className={classes.profile}>
                            <Avatar className={classes.purple} src={user.result.imageURL} 
                                alt={user.result.name}>{user.result.name.charAt[0]}</Avatar>
                            <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                            <Button onClick={logout} variant="contained" className={classes.logout} color='secondary'>Logout</Button>
                        </div>
                    ) : (
                        <Button component={Link} to='/auth' variant='contained' color='primary'>Sign In</Button>
                    )
                }
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
