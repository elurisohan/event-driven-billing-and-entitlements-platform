import { useState } from "react";
import {api} from "../api/axios";
import CreateTaskModal from "./CreateTaskModal";
import  createProject,getProjects, getTasksByProject  from "../services/projectService";

export default function CreateModal({onClose,onProjectCreated}){
    const [name,setName]=useState("");
    const [description,setDescription]=useState("");
    const [showCreateTaskModal,setShowCreateTaskModal]=(false);
    const [tasks, setTasks] = useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);
    const [projects,setProjects]=useState(null);

 /*   
    function addTask(){
        //let's call createTask Component. This component should show a form where we send the request to backend
        
        /*
        if(!taskName.trim()) {
            alert("Task name is required");
            return;
        }

        const newTask = {
            name: taskName,
            description: taskDescription,
            status: taskStatus,
            priority: taskPriority,
            dueDate: taskDueDate
        };

        setTasks([...tasks, newTask]);
        
        // Reset task form
        setTaskName("");
        setTaskDescription("");
        setTaskStatus("NEW");
        setTaskPriority("LOW");
        setTaskDueDate("");
    */
    
    

    function removeTask(index){
        setTasks(tasks.filter((_, i) => i !== index));
    }

    async function handleCreatedTasks(e){
        //here we need to attach tasks with Project
        e.preventdefault();
        setLoading(true)
        try{
            const responseProjects=await getProjects();
            const projectWithTasks=Promise.all(
                responseProjects.map(async (project)=>{
                    try{
                    const tasks=await getTasksByProject(project.id)
                    return {...project,tasks}
                    }
                    catch (err){
                        console.error(err.message)
                        return {...project,tasks:[]};
                    }
                })

            )
            setProjects(projectWithTasks)
        }
        catch(err){
            setError(true)
            
        }
        finally{
            setLoading(false)
        }
    }

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true);
        setError(false);

        try{
        const res=await createProject({
            name,
            description
        })
        
        onProjectCreated(res.data);
        onClose();
       }
       catch(err){
           setError(err.message|| "Failed to create Project")
       }
       finally{
        setLoading(false)
       }
    }

    return (
        <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
        <h2>Create Project</h2>

        {error && <p style={{color:"red"}}>{error}</p>}

        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Project Title *</label>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Project Description *</label>
                <textarea
                    style={styles.textarea}
                    placeholder="Describe your project"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    required
                />
            </div>       
                

            <div style={styles.buttonGroup}>
                <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? "Creating..." : "Create Project"}
                </button>
            </div>

            <div>   
                <button type="button" onClick={()=>setShowCreateTaskModal(true)} style={styles.addTaskButton}>
                    + Add Task
                </button>
            </div>  

            {showCreateTaskModal && <CreateTaskModal
                 // send projectId here  projectId={pro}
                    onClose={()=>setShowCreateTaskModal(false)}
                    onTaskCreated={()=>handleCreatedTasks()}
            />  
            }
            
        </form>
        </div>
        </div>
    )
}


const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    formGroup: {
        marginBottom: '15px'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px',
        minHeight: '80px',
        boxSizing: 'border-box',
        resize: 'vertical'
    },
    select: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    tasksSection: {
        marginTop: '25px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
    },
    taskForm: {
        marginTop: '15px'
    },
    addTaskButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px'
    },
    tasksList: {
        marginTop: '20px'
    },
    taskItem: {
        backgroundColor: 'white',
        padding: '12px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd'
    },
    taskItemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px'
    },
    taskItemDesc: {
        margin: '5px 0',
        fontSize: '14px',
        color: '#666'
    },
    taskItemDetails: {
        display: 'flex',
        gap: '15px',
        fontSize: '13px',
        color: '#888'
    },
    removeButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '4px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        marginTop: '25px'
    },
    cancelButton: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '14px'
    },
    submitButton: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#2196F3',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px'
    }
}