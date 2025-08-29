import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isLogin = async(req, res, next)=>{
        try{
            const bearer = req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.split(' ')[1]:null;
            const token = req.cookies?.token || bearer;

            if (!token) return res.status(401).json({ message: "Token not provided" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        }catch(err){
            res.status(401).json({message:'Not authorized, token failed', error: err.message});
        }
}

export const isAdmin = async(req, res, next)=>{
        try{
            const bearer = req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.split(' ')[1]: null;
            const token = req.cookies?.token || bearer;
            if(!token)res.status(401).json({message:'Token not provided'});
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            console.log(`token from cookie: ${token}`);
            console.log(`token from bearer: ${bearer}`);
            console.log(`user: ${user}`);
            console.log(`user role: ${user.role}`);

            if(!user || user.role!=='admin'){
                return res.status(403).json({message:'Access denied'});
            }
            req.user=user;
            next();
        }catch(err){
            res.status(401).json({message:'Not authorized, Token failed'});
        }
}