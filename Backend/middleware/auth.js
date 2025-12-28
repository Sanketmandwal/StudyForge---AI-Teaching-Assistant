import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect = async (req, res, next) => {
    let token


    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1]
    }

 
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Not authorized, no token",
            statusCode: 401
        })
    }

    try {
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET)


        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
                statusCode: 401
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.error("Auth middleware error:", error.message)

    
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                error: "Token expired",
                statusCode: 401
            })
        }

    
        return res.status(401).json({
            success: false,
            error: "Not authorized, token failed",
            statusCode: 401
        })
    }
}

export default protect
