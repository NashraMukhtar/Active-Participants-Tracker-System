import Proof from '../models/Proof.js';
import User from '../models/User.js';

export const proofSubmission = async(req, res)=>{
    try{
        const imageUrl = req.file?.path;

        if(!imageUrl) return res.status(400).json({message:'Image not provided'});

        const proof = await Proof.create({
            user:req.user._id,
            imageUrl,
            submittedAt: new Date(),
        });

        res.status(201).json({status: true,message:'Proof submitted successfully!',proof});
    }catch(err){
        res.status(500).json({message:'Server error', error:err.message});
    }
}

export const proofApproval = async(req, res)=>{
    try{
        const proof = await Proof.findById(req.params.id);
        if(!proof) return res.status(404).json({message:'Proof not found'});
        
        const user = await User.findById(proof.user);
        if(!user) return res.status(404).json({message:'User not found'});

        const today = new Date();
        const lastDate = user.lastProofDate ? new Date(user.lastProofDate) : null;

        const isSameDay = lastDate && lastDate.toDateString() === today.toDateString();
        const isYesterday = lastDate && new Date(today - 24 * 60 * 60 * 1000).toDateString() === lastDate.toDateString();

        if(isSameDay){

        }else if(isYesterday){
            user.streak = (user.streak || 0) + 1;
        }else{
            user.streak=1;
        }

        user.lastProofDate = today;

        await Proof.findByIdAndDelete(proof._id);

        await user.save();

        res.status(200).json({message:'Proof approved, streak updated, lastProofDate set to today(proof approve date)'})
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}