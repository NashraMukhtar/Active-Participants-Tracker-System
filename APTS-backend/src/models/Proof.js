import mongoose from 'mongoose';

const ProofSchema = new mongoose.Schema({
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl:  { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

const Proof = mongoose.model('Proof',ProofSchema);
export default Proof;