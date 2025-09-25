import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './State/hooks';
import { fetchMe } from './State/authSlice';
import { useEffect } from 'react';
import Login from './Features/Login';
import { Home } from './Features/HomePage';

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/home' element={<Home/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
