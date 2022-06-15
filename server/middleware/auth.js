// middleware is created to check if a verified logged in user can perform
// actions such as like,comment etc. For e.g. if a user want to like a post:
// 1. He clicks the like button
// 2. auth Middleware checks if he is verified to like the post.
// 3. If he is verified auth middleware (next) method is called 
// which calls the like controller finally.
// refer to posts.js in routes if the code is such that, router.patch('/:id/likePost',auth, likePost),
// we're importing the auth function from here to posts.js and calling it right before likePost function
// so if middlware grants access to like the post it will call next() that will run the next func,
// which is likePost for this case.

import jwt from 'jsonwebtoken'

const auth = async(req,res,next)=> {
    try{
        const token = req.headers.authorization.split(' ')[1]
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQGVtLmNvbSIsImlkIjoiNjIzYjFiOGU0OGYyNzNiOGM0YmI0Y2JkIiwiaWF0IjoxNjQ4MTA3NTMwLCJleHAiOjE2NDgxMTExMzB9.thD7NXYmDQrlhEAHuLXHC-KxToqbNqTJAd-GFfdJyfg"
        console.log('\ntoken-M/Ware->auth.js:18:',token);
        // checking if token is from google OAuth or web's authentication
        const isCustomAuth = token?.length < 500
        // console.log('\nisCustomAuth-M/Ware->auth.js:21:',isCustomAuth);
        let decodedData
        if(token && isCustomAuth){
            try{
                decodedData = jwt.verify(token,'test')
            }catch(error){
                console.log(error);
            }
            // populating the request for auth func. So if route is like
            //  router.patch('/:id/likePost',auth, likePost), then we can call req.userId even in likePost.
            req.userId = decodedData?.id
            console.log('\nreq.userID-M/Ware->auth.js:',req.userId,);
        }else{
            decodedData = jwt.decode(token)
            // sub is a function that differentiates every user based on the token from google OAuth
            req.userId = decodedData?.sub
        }
        next()
        console.log("\nMiddleware verification finished");
    }catch(error){
        console.log(error);
    }
}
export default auth