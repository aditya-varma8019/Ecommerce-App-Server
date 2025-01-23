import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../utils/auth.js";
import JWT from "jsonwebtoken";


const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, role, question } = req.body;

        if (!name) {
            return res.send({
                success: false,
                message: "Name is required"
            })
        }
        if (!email) {
            return res.send({
                success: false,
                message: "Email is required"
            })
        }
        if (!password) {
            return res.send({
                success: false,
                message: "Password is required"
            })
        }
        if (!phone) {
            return res.send({
                success: false,
                message: "Phone is required"
            })
        }
        if (!address) {
            return res.send({
                success: false,
                message: "Address is required"
            })
        }
        if (!question) {
            return res.send({
                success: false,
                message: "Question is required"
            })
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Email already exists"
            })
        }
        else {
            const hashedPassword = await hashPassword(password);
            const newUser = await new userModel({
                name, email, password: hashedPassword, phone, address, question
            })

            await newUser.save();

            res.status(201).send({
                success: true,
                message: "Registration successful",
                newUser
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Registration failed",
            error
        })
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Please provide email and password"
            })
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid email"
            })
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            })
        }


        const userToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            userToken,
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Login failed",
            error
        })
    }
}

//forgotPasswordController

const forgotPasswordController = async (req, res) => {
    try {
        const { email, question, newPassword } = req.body;
        if (!email) {
            res.status(400).send({
                success: false,
                message: "Email is required"
            })
        }

        if (!question) {
            res.status(400).send({
                success: false,
                message: "Question is required"
            })
        }

        if (!newPassword) {
            res.status(400).send({
                success: false,
                message: "New password is required"
            })
        }

        // check email and question(answer) is matched or not
        const user = await userModel.findOne({ email, question });

        if (!user) {
            res.status(400).send({
                success: false,
                message: "Invalid email or question"
            })
            return;
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password reset successful"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Forgot password failed",
            error
        })
    }
}

const testController = async (req, res) => {
    res.send('Test controller');
}

export { registerController, loginController, testController, forgotPasswordController }

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.json({ error: 'Password is required and should be 6 characters long' });
        }

        const hashedPassword = password ? await hashPassword(password) : null;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            address: address || user.address,
            phone: phone || user.phone
        }, { new: true }).select('-password');

        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            updatedUser
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while updating profile",
            error
        })
    }
}

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
        res.status(200).send({
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("products", "-photo").populate("buyer", "name").sort({ createdAt: -1 });
        res.status(200).send({
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })
    }
}

export const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

        res.status(200).send({
            success: true,
            message: "Order status updated successfully",
            updatedOrder
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating order status",
            error
        })
    }
}