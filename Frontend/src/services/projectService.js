import api from "../api/axios";


const api_url="http://localhost:8081/api/v1"

export async function getProjects() {
    const response=await api.get(`${api_url}/projects/`);
    return response.data;
}

export async function createProject(projectData){
    const response=await api.post(`${api_url}/projects/`,projectData);
    return response.data;
}

export async function updateProject(projectId, projectData){
    const response=await api.patch(`${api_url}/projects/${projectId}`, projectData);
    return response.data;
}

export async function deleteProject(projectId){
    const response=await api.delete(`${api_url}/projects/${projectId}`);
    return response.data;
}