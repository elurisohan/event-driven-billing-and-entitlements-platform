import api from "../api/axios";

export async function loginUser(credentials){
    try {
    const response=await api.post('/auth/login',credentials)//use backticks here and not usual quotes
    return response.data;
    }
    catch (err){
        throw err.response?.data || {message:"Network error"};
    }
}

export async function registerUser(details){
    try{
    const response=await api.post('/auth/register',details);
        return response.data;
} catch (err){
        const payload= err.response?.data ||  { message: "Network error" };
        throw payload
    }

}