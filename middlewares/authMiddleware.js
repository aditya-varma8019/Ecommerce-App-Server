import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';


export const requireSignin = (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        // console.log(req.user);
        next();
    } catch (error) {
        console.log(error);
    }
}

export const adminSignIn = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role === 0) {
            return res.status(401).send({
                success: false,
                message: "Admin resource! Access denied"
            })
        }
        else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Admin resource! Access denied",
            error
        })
    }
}