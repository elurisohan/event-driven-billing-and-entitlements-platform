import axios from 'axios';

//axios.create(config) takes a config object that can contain many known keys like baseURL, headers, timeout, withCredentials, etc.


const api=axios.create({
    baseURL:"http://localhost:8081/api/v1",
})

api.interceptors.request.use((config)=>{
    const token=sessionStorage.getItem("token")
    if (token){
        config.headers["Authorization"]=`Bearer ${token}`
    }
    return config
},
(error)=> Promise.reject(error))

// Response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
    (respo)=>respo,
    (error)=>{
        if (error.response && error.response.status=='401') {
            sessionStorage.removeItem('token');
            const currentPath=window.location.pathname;

            if (currentPath!=='/login' && currentPath!=='/signup'){
                window.location.href('/login');

            }
        }
        // Return the error so it can be handled by the calling code
        return Promise.reject(error);
    }
)

export default api ;