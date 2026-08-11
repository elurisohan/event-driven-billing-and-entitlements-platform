import api from "../api/axios";


export async function getProjects() {
    const response=await api.get('/projects/');
    return response.data;
}

export async function createProject(projectData){
    const response=await api.post('/projects/',projectData);
    return response.data;
}

export async function updateProject(projectId, projectData){
    const response=await api.patch(`/projects/${projectId}`, projectData);
    return response.data;
}

export async function deleteProject(projectId){
    const response=await api.delete(`/projects/${projectId}`);
    return response.data;
}