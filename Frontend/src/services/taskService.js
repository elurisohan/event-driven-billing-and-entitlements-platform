import api from "../api/axios.js";

const api_url="http://localhost:8081/api/v1"

export async function getTask(taskId){
    const tasks=await api.get(`${api_url}/tasks/${taskId}`)
    return tasks.data
}


export async function getTasksByProject(projectId){
    const tasks=await api.get(`${api_url}/projects/${projectId}/tasks`)
    return tasks.data
}
    

export async function createTask(projectId,task){
    const createdTask=await api.post(`${api_url}/projects/${projectId}/tasks`,task);
    return createdTask.data
}

export async function updateTask(taskId,taskDTO){
    const updatedTask=await api.patch(`${api_url}/tasks/${taskId}`,taskDTO);
    return updatedTask.data    
}

export async function deleteTask(taskId){
    const deletedTask=await api.delete(`${api_url}/tasks/${taskId}`)
    return deletedTask.data
}

