import express from 'express'
import {body} from 'express-validator'
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
} from '../controllers/authController.js'
import protect from '../middleware/auth.js';

const authRouter = express.Router();

const registerValidation = [
    body('username').trim().isLength({min:3}).withMessage("Username Must Be 3 character"),
    body('Email').isEmail().normalizeEmail().withMessage("Please Provide a valid email"),
    body('password').isLength({min:6}).withMessage("Passowrd Must be 6 character")
]

const loginValidation = [
    body('Email').isEmail().normalizeEmail().withMessage("Please Provide a valid email"),
    body('password').notEmpty().withMessage("Passowrd is required")
]

authRouter.post('/register', registerValidation , register)
authRouter.post('/login',loginValidation,login)

authRouter.get('/profile',protect , getProfile)
authRouter.put('/profile', protect , updateProfile) 
authRouter.post('/change-password', protect , changePassword)

export default authRouter