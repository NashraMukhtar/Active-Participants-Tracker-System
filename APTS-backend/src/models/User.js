import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    gender:{type:String, enum:['male','female'], required:true},
    age:         { type: Number },
    country:     { type: String, required: true },
    city:        { type: String, required: true },
    area:      { type: String, required: true },
    phoneNumber: {
    type: String,
    required: true,
    match: [/^(\+?\d{10,15})$/, 'Please enter a valid phone number'],
    unique: true
    },
    streak: {type: Number,default: 0},
    lastProofDate: {type: Date},

    role:{
        type:String,
        enum:['entry', 'active', 'admin'],
        default: 'entry'
    }
},{timestamps:true});

const User = mongoose.model('User', UserSchema);
export default User;