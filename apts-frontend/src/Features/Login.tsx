import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../State/hooks";
import { login } from "../State/authSlice";
import { useNavigate } from "react-router-dom";

const Login = ()=>{
    const [form, setForm] = useState({email:'', password:''});
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault();
        dispatch(login(form));
        navigate('/home');
    }

    return(
        <form onSubmit={handleSubmit}>
            <input 
                placeholder="Email"
                value={form.email}
                onChange={(e)=>{setForm({...form, email:e.target.value})}}
            />
            <input 
                placeholder="password"
                value={form.password}
                onChange={(e)=>{setForm({...form, password:e.target.value})}}
             />
             <button type="submit">
                Login
             </button>
        </form>
    )
}   

export default Login;