import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId)=>{
    return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn:'7d',});
}

export const register = async(req, res)=>{
    try{
        const {username, email, password, gender, age, country, city, area, phoneNumber} = req.body;

        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({message:'User already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({username, email, password:hashedPassword, gender, age, country, city, area, phoneNumber});

        res.status(201).json({message:'User created successfully!', user: {
            id:newUser._id,
            email:newUser.email,
            username:newUser.email,
            phoneNumber:newUser.phoneNumber
        }})
    }catch(err){
        res.status(500).error({message:'Server error',error:err.message});
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


