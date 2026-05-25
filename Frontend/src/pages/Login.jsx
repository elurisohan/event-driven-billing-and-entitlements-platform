import { useContext, useState } from "react";
import { loginUser } from "../services/authService";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login}=useContext(AuthContext)
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      let data=await loginUser({email,password});
      login(data.token)
      //localStorage.setItem("token",data.token);
      navigate("/home");
    }
    catch (e){
      alert(e.message ||"Login failed");
    }
  };
//className="text-2xl font-semibold text-center mb-4"
  return (
    <div style={styles.container}>
      <form
        onSubmit={handleSubmit}
        style={styles.form}
        //className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        
        <h2 >Login</h2>

        <input
          type="email"
          placeholder="Email"
          //className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          //className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
        style={styles.button}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

const styles={
  container: {
    flex: 1,
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    padding: '24px',
  },
  button:{
    padding:'5px'
    , borderRadius:'5px',
    background:'#007bff',
    margin:'10px',
    color:'white'
    , cursor:'pointer'
  },

  form:{
    display:'flex',
    flexDirection:'column',
    padding:'20px',
    gap:'12px',
    borderRadius:'5px',
    width:'320px',
    boxShadow:"0 10px 25px rgba(15, 23, 42, 0.12)"
  }
}
