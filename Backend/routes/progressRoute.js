import express from 'express'
import {
    getDashboard
} from '../controllers/progressController.js'

import protect from '../middleware/auth.js'

const progressRouter = express.Router()

progressRouter.use(protect)

progressRouter.get('/dashboard' , getDashboard)

export default progressRouter