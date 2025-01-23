import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';


export const requireSignin = (req, res, next) => {
    try {
        // Check if the Authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header is required" });
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1]; // "Bearer <token>"
        if (!token) {
            return res.status(401).json({ error: "Authorization token is required" });
        }

        // Verify the token
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode; // Attach the decoded user data to the request object
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

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