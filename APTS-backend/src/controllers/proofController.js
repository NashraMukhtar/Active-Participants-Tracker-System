import Proof from '../models/Proof.js';
import User from '../models/User.js';

export const proofSubmission = async(req, res)=>{
    try{
        const imageUrl = req.file?.path;
        if(!imageUrl) return res.status(400).json({message:'image not provided'});

        const user = await User.findById(req.user._id);
        if(!user) return res.status(400).json({message:'user not found'});

        const nowUTC = new Date(new Date().toISOString());

        const proof = await Proof.create({
            user:req.user._id,
            imageUrl,
            submittedAt: nowUTC,
        });

        let streak = 1;
        if(user.lastProofDate){
            const lastProofDateUTC = new Date(user.lastProofDate);
            const diffDays = Math.floor((nowUTC - lastProofDateUTC) / (1000 * 60 * 60 * 24));
            if(diffDays===1){
                streak = user.streak+1;
            }else if(diffDays===0){
                return res.status(400).json({message:'You have already submitted proof today'});
            }else{
                streak=1;
            }
        }

        user.lastProofDate = nowUTC;
        user.streak = streak;

        if(user.streak>=3 && user.role!='active'){
            user.role='active';
            console.log(`user ${user} promoted to 'active' role`);
        }

        await user.save();

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

        const today = new Date(proof.submittedAt);
        const lastDate = user.lastProofDate ? new Date(user.lastProofDate) : null;

        const getUTCMidnight = (date)=>Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

        const todayUTC = getUTCMidnight(today);
        const lastDateUTC = lastDate? getUTCMidnight(lastDate): null;

        const isSameDay = lastDateUTC && lastDateUTC === todayUTC;
        const isYesterday = lastDateUTC && todayUTC - lastDateUTC === 24 * 60 * 60 * 1000;

        if(isSameDay){

        }else if(isYesterday){
            user.streak = (user.streak || 0) + 1;
        }else{
            user.streak=1;
        }

        if(user.streak>=3){
            user.role='active';
            console.log(`user ${user} promoted to active role`);
        }

        user.lastProofDate = proof.submittedAt;

        await Proof.findByIdAndDelete(proof._id);

        await user.save();

        res.status(200).json({message:'Proof approved, streak updated, lastProofDate set (proof submission date)'});
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const getAllProofs = async(req, res)=>{
    try{
        const proofs = await Proof.find().populate('user', 'username email');
        res.status(200).json({proofs});
    }catch(err){
        res.status(500).json({message:'server error', error:err.message});
    }
}

export const deleteProof = async(req, res)=>{
    try{
        const result = await Proof.findByIdAndDelete(req.params.id);
        if(!result)return ResizeObserver.status(404).json({message:'proof not found'});
        res.status(200).json({message:'Proof deleted successfully!'});
    }catch(err){
        res.status(500).json({message:'server error', error:err.message});
    }
}
