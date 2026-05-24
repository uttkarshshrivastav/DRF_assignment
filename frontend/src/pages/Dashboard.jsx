
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  useEffect(()=>{
    if (!isAuthenticated){
      navigate("/login")
    }
  }, [])

  return (
    <>
      <p className="text-black ">Welcome {user?.alias}!</p>
    </>
  );
}
