import axios from 'axios';
//axios.create(config) takes a config object that can contain many known keys like baseURL, headers, timeout, withCredentials, etc.
const api=axios.create({
    baseURL:"http://localhost:8081/api/v1",
})

api.interceptors.request.use(
    (config)=>{
        const token=sessionStorage.getItem("token");

    if (token){
        config.headers["Authorization"]=`Bearer ${token}`;
    }
    return config;
},
(error)=>{
   return Promise.reject(error());
    }
)

export default api;