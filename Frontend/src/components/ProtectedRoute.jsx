import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";



export default function ProtectedRoute({children}){//React will pass a props object with a children field, not a raw child argument
     const {isAuthenticated}=useContext(AuthContext);

    if (!isAuthenticated){
        return <Navigate to='/login' replace/>;
    }
    return children;
}

//Remember when to use useNavigate or above vs window.location.href (this causes full reload)

//<Navigate /> is declarative: you “render” a redirect when a condition is true.

//useNavigate is imperative: you call navigate("/login") in a handler or effect