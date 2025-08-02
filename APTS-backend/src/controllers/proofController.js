import Proof from '../models/Proof.js';

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