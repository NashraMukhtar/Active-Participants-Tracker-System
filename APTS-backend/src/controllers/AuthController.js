import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/sendMail.js';

dotenv.config();

const generateToken = (userId)=>{
    return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn:'7d',});
}

export const register = async(req, res)=>{
    try{
        const {username, email, password, gender, age, country, city, area, phoneNumber} = req.body;

        const existingEmail = await User.findOne({email});
        if(existingEmail) return res.status(400).json({message:'User with this email already exists'});

        const existingNumber = await User.findOne({phoneNumber});
        if(existingNumber) return res.status(400).json({message:'User with this number already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({username, email, password:hashedPassword, gender, age, country, city, area, phoneNumber});

        res.status(201).json({message:'User created successfully!', user: {
            id:newUser._id,
            email:newUser.email,
            username:newUser.username,
            phoneNumber:newUser.phoneNumber
        }})
    }catch(err){
        res.status(500).json({message:'Server error',error:err.message});
    }
}

export const login = async(req, res)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'Incorrect email'});

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) return res.status(400).json({message:'Incorrect password'});

        const token = generateToken(user._id);

        const isProd = process.env.NODE_ENV==='production';
        const sameSite = isProd? 'none':'lax';

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite,
            maxAge: 7*24*60*60*1000,
            path: '/',
        })

        res.status(200).json({
            message:'Logged in successfully!',
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                phoneNumber:user.phoneNumber,
                role:user.role,
            },
        });
    }catch(err){
        res.status(500).json({message:'server error', error:err.message});
    }
}

export const logout = async(req, res)=>{
    try{
        const isProd = process.env.NODE_ENV === 'production';
        const sameSite = isProd? 'none':'lax'

        res.clearCookie('token', {
            httpOnly:true,
            secure: isProd,
            sameSite,
            path:'/',
        })
        res.status(200).json({message:'Logged out successfully!'});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

export const makeMeAdmin = async(req, res)=>{
    try{
        const user = await User.findById(req.user._id);

        if(!user)return res.status(404).json({message:'user not found'});

        user.role = 'admin';
        await user.save();
        res.status(200).json({message:'you are now an admin'});
    }catch (err) {
        res.status(500).json({ message: 'Failed to make admin', error: err.message });
    }
}

export const allUsers = async(req, res)=>{
    try{
        const users = await User.find();
        res.status(200).json({users});
    }catch(err){
        res.status(500).json({message: 'Failed to fetch users', error: err.message});
    }
}

export const deleteUser = async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({message:'user not found'});
        }else if(user.role==='admin'){
            return res.status(400).json({message:'cannot delete an admin'});
        }else{
            await User.findByIdAndDelete(user._id);
        }

        res.status(200).json({message:'User deleted successfully!'});
    }catch(err){
        res.status(500).json({message: 'Failed to delete user', error: err.message});
    }
}

export const demoteUsers = async(req, res)=>{
    try{
        const activeUsers = await User.find({role:'active'});

        const today = new Date();
        const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

        if(!activeUsers || activeUsers.length===0){
            console.log('no active users present');
            return;
        }

        for(const user of activeUsers){

            const lastdate = new Date(user.lastProofDate);
            const lastDateUTC = Date.UTC(lastdate.getUTCFullYear(), lastdate.getUTCMonth(), lastdate.getUTCDate());

            const differenceInDays = todayUTC-lastDateUTC;
            const diffInDaysAfterDiv = differenceInDays/(1000*60*60*24);

            if(diffInDaysAfterDiv>=3){
                user.role='entry';
                user.streak=0;
                await user.save();
                console.log(`${user.username} demoted successfully!`);
            }
        }
        console.log('No users to demote!');
    }catch(err){
        console.log(`Error demoting users, ERROR: ${err.message}`);
    }
}

export const requestPasswordReset = async(req, res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'User Not Found'});

        console.log(`user to send mail: ${user.email}`);

        const resetToken = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

        // const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        // const message = `Click the link below to reset your password: \n\n ${resetPasswordURL}`;
        const message = `Click the link below to reset your password, your reset token: ${resetToken}`;

        await sendEmail(user.email, 'Password Reset Request', message);

        res.status(200).json({message:'Reset password email sent successfully!'});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

export const resetPassword = async(req, res)=>{
    try{
        const {token} = req.params;
        const {password} = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if(!user) return res.status(400).json({message:"user not found"});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(200).json({message:"password reset successfully!"});
    }catch(err){
        res.status(500).json({message:'Invalid or expired token',error:err.message});
    }
}