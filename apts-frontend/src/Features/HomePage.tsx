import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../State/hooks";
import { logout } from "../State/authSlice";
import { useNavigate } from "react-router-dom";

export const Home = ()=>{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout=()=>{
        dispatch(logout());
        navigate('/login');
    }
    const {status, error, user} = useAppSelector((state)=>state.auth);
    return(
        <div>
            {status === 'loading' && <p>Loading...</p>}
            <h1>Welcome Home {user?.username} </h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}