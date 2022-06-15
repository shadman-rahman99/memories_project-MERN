import express from 'express'

import { signIn, signUp } from '../controllers/users.js'

const router = express.Router()
// using post methods because we have to specifically set all the details from the form to the backend
router.post('/signIn', signIn)
router.post('/signUp', signUp)

export default router;