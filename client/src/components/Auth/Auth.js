import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import { Avatar, TextField, Button, Paper, Typography, Container, Grid } from '@material-ui/core'
import LockOutlined from '@material-ui/icons/LockOutlined'
import makeStyles from './style'
import Input from './Input'
import Icon from './icon'
import { signUp, signIn } from '../../actions/auth'

const initialFormdata = { firstName:'', lastname:'', email:'', password:'', confirmPassword:'' } 

function Auth() {
    const [isSignup, setIsSignup] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(initialFormdata)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const classes = makeStyles() 
    
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(isSignup){
            dispatch(signUp(formData, navigate))
        }else{
            dispatch(signIn(formData, navigate))
        }
    }
    const handleChange = (e)=>{
        setFormData({...formData, [e.target.name]: e.target.value })
    }
    const switchMode = ()=> { 
        setIsSignup((prevIsSignup) => !prevIsSignup)
        if(showPassword != false) return  handleShowPassword(false)
    } 

    const googleSuccess = async(res)=> {
        const result = res?.profileObj
        const token = res?.tokenId
        try{
            dispatch({ type: 'AUTH', data: {result, token}})
            navigate('/')
        }catch(error){
            console.log(error);
        }
    }
    const googleError = (error)=> {
        console.log(error);
    }
    const handleShowPassword = ()=> setShowPassword((prevShowPassword) => !prevShowPassword)

    return (
        <Container component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlined/>
                </Avatar>
                <Typography variant='h5'>{isSignup? 'Sign Up':'Sign In'} </Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                    { isSignup && (
                        <>
                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                        <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                        </>
                    )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In' }
                    </Button>
                    <GoogleLogin
            clientId="903468864900-msifdfrm8i5ln81bko2ehps7th2rspsf.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup? 'Already have an account? Sign In': 'Dont have an account? Sign Up'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth
