import api from "../api/axios.js";

export async function getTask(taskId){
    const tasks=await api.get(`/tasks/${taskId}`)
    return tasks.data
}


export async function getTasksByProject(projectId){
    const tasks=await api.get(`/projects/${projectId}/tasks`)
    return tasks.data
}
    

export async function createTask(projectId,task){
    const createdTask=await api.post(`/projects/${projectId}/tasks`,task);
    return createdTask.data
}

export async function updateTask(taskId,taskDTO){
    const updatedTask=await api.patch(`/tasks/${taskId}`,taskDTO);
    return updatedTask.data    
}

export async function deleteTask(taskId){
    const deletedTask=await api.delete(`/tasks/${taskId}`)
    return deletedTask.data
}

