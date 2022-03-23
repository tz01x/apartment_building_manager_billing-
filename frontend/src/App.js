import {  Routes,Route,useNavigate} from "react-router-dom";
import { useGetPokemonByNameQuery } from './slice/pokemon-slices';
import './App.css';
import Login from './component/login/login';
import BS5Nav from './component/nav/bs5-nav';
import Home from './home/home'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoginWithRefreshToken } from "./slice/user-slices";

function App() {
  const {data,isError,isLoading} = useGetPokemonByNameQuery("pikachu");
  const user=useSelector(state=>state.user);
  const navigate =useNavigate();
  const dispatch= useDispatch();

  useEffect(()=>{
    
    if( user.refresh ){
      // auto login with refresh token 
      dispatch(userLoginWithRefreshToken(user.refresh));
    }

  },[])

  useEffect(()=>{
    if(user.access){
      navigate('/');
    }else{
      navigate('/login');
    }
  },[user])
  
  return (
    
    <div className="App">
      <BS5Nav/>
      {!isLoading?
      <img src={data.sprites.front_shiny} />
      : <div>loading.....</div>
    }

      
      <Routes>

        <Route path="login" element={ <Login />}></Route>
        <Route path="" element={ <Home/> }></Route>
      
      </Routes>

    </div>
    
 
  );
}

export default App;
