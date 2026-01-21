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
   return Promise.reject(error);
    }
)

// Response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => {
        // If response is successful, return it as is
        return response;
    },
    (error) => {
        // Check if the error is a 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Clear the token from sessionStorage
            sessionStorage.removeItem("token");
            
            // Only redirect if we're not already on the login page (prevents redirect loops)
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/signup') {
                // Redirect to login page
                // Using window.location.href ensures a full page reload and works outside React context
                window.location.href = '/login';
            }
        }
        // Return the error so it can be handled by the calling code
        return Promise.reject(error);
    }
);

export default api;