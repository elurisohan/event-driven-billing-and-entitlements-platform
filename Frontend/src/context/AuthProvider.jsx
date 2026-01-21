import { useState  } from "react";
import { AuthContext } from "./AuthContext";

export function Authprovider({children}){
    //token,login,logout

    const [token,setToken]=useState(()=>{
        const savedToken=sessionStorage.getItem("token");
        return savedToken ?? null
    });

/*
This code was giving errors. because we cannot use setToken inside useEffect because that would cause continuous renders. so we wrote above code
    //when you login, you want the token to be set
    useEffect(()=>{
        const savedToken=localStorage.getItem("token");
        if (savedToken){
        setToken(savedToken);//remember that you don't have to write implementation for setToken. React does that for you automatically.       
        }
    },[])*/
    //login function

    const login=(newToken)=>{
        sessionStorage.setItem("token",newToken);
        setToken(newToken);
    }

    const logout=()=>{
        sessionStorage.removeItem("token");
        setToken(null);
    }

    const isAuthenticated=!!token;

    return (
        <AuthContext.Provider value={{token,login,logout,isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}