import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Auth from './components/Auth/Auth'
import PostDetails from './components/PostDetails/PostDetails'
import { Container } from '@material-ui/core'

function App() {
    // const navigate = useNavigate()
    // const user = JSON.parse(localStorage.getItem('profile'))
    return (
        <BrowserRouter>
            <Container maxWidth='xl'>
                {/* placing Navbar here since it will always show */}
                <Navbar/>
                    <Routes>
                        <Route exact path='/posts' element={<Home/>} />
                        <Route exact path='/' element={ <Navigate replace to="/posts" /> }/>
                        <Route exact path='/posts/search' element={<Home/>} />
                        <Route path='/posts/:id' element={<PostDetails/>} />
                        {/* <Route exact path='/auth' element={!user? <Auth/> : <Navigate replace to="/posts" /> }/> */}
                        <Route exact path='/auth' element={ <Auth/>}/>
                    </Routes>
            </Container>
        </BrowserRouter>
    )
}

export default App
