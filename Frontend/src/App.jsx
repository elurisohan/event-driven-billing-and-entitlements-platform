//import { useState } from 'react'

//import './App.css'
import {BrowserRouter,Link,Route,Routes} from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Plans from './pages/Plans.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';




function App() {
  //const [count, setCount] = useState(0)
//in React JSX style is an attribute on elements like nav, div, etc., and its value is a JavaScript object instead of a string.
  return (
    <BrowserRouter>
    <nav 
    style={{display:'flex',
    justifyContent:'center',
    alignItems:'center',
    padding:'20px',
    borderBottom:'1px solid #ddd '
    }}>
      <div style={{
        padding:"20px",
        display:'flex',
        gap:'16px',
        fontSize:'18px' }}>
    <Link style={{textDecoration:'none'
    }} to='/login'>login</Link>|{" "}
    <Link to='/signup'>signup</Link>|{" "}
    <Link to='/home'>Home</Link>|{" "}
    <Link to='/plans'>Plans</Link>
</div>
</nav>

    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Register/>}/>
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
      <Route path="/plans" element={<Plans />}/>
    </Routes>
    </BrowserRouter>
  );
  
}


export default App;