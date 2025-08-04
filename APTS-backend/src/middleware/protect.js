import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isLogin = async(req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id);

            next();
        }catch(err){
            res.status(401).json({message:'Not authorized, token failed', error: err.message});
        }
    }else{
        res.status(401).json({message:'Token not provided'});
    }
}

export const isAdmin = async(req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if(user.role!=='admin'){
                return res.status(403).json({message:'Access denied'});
            }
            next();
        }catch(err){
            res.status(401).json({message:'Not authorized, Token failed'});
        }
    }else{
        res.status(401).json({message:'Token not provided'});
    }
}