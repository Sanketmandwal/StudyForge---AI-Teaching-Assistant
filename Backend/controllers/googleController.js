import { OAuth2Client } from "google-auth-library"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const { email, name, picture, sub } = ticket.getPayload()

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        username: name,
        email,
        profileImage: picture,
        googleId: sub,
        authProvider: "google",
      })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
        token,
      },
    })
  } catch (err) {
    res.status(401).json({
      success: false,
      error: "Google authentication failed",
    })
  }
}
