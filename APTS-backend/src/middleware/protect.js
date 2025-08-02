import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async(req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('from authMiddleware.js: ',decoded);

            req.user = await User.findById(decoded.id);

            next();
        }catch(err){
            res.status(401).json({message:'Not authorized, token failed', error: err.message});
        }
    }else{
        res.status(401).json({message:'Token not provided'});
    }
}