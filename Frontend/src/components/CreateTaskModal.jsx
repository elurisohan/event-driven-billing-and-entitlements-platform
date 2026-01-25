//have a Task state and it's details. and once saved, it should post to backend. and can return from  here and we can add the task to a project inside createModal instead of Home
import {createTask} from "../services/taskService.js";
import { useState} from "react";


export default function CreateTaskModal({projectId,onClose,onTaskCreated}){
    

    // Task form states
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null)
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState("NEW");
    const [taskPriority, setTaskPriority] = useState("LOW");
    const [taskDueDate, setTaskDueDate] = useState("");
    //const [showCreateTaskModal,setShowCreateTaskModal]=useState(false);
    //useEffect and show form. User need not save seperately. 

    console.log("Task called")

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
        const task={
            name:taskName,
            description:taskDescription,
            status: taskStatus,
            priority:taskPriority,
            dueDate:taskDueDate}
        const newTask=await createTask(projectId,task);
        // Notify parent component that task was created
        if (onTaskCreated) {
            onTaskCreated(newTask);
        }
        onClose();
        }
        catch(e){
            setError(e.message)
        }
        finally{
       setLoading(false)
       
        }
}


    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
        <form onSubmit={handleSubmit}>
            {/* Tasks Section */}
            <div style={styles.tasksSection}>
                <h3>Tasks (Optional)</h3>
                
                {/* Task Form */}
                <div style={styles.taskForm}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Task Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Task name"
                            value={taskName}
                            onChange={(e)=>setTaskName(e.target.value)}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Task Description</label>
                        <textarea
                            style={styles.textarea}
                            placeholder="Task description"
                            value={taskDescription}
                            onChange={(e)=>setTaskDescription(e.target.value)}
                        />
                    </div>

                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Status</label>
                            <select 
                                style={styles.select}
                                value={taskStatus} 
                                onChange={(e)=>setTaskStatus(e.target.value)}
                            >
                                <option value="NEW">NEW</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="DONE">COMPLETED</option>
                               
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Priority</label>
                            <select 
                                style={styles.select}
                                value={taskPriority} 
                                onChange={(e)=>setTaskPriority(e.target.value)}
                            >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                            
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Due Date</label>
                            <input
                                style={styles.input}
                                type="date"
                                value={taskDueDate}
                                onChange={(e)=>setTaskDueDate(e.target.value)}
                            />
                        </div>
                    </div>  

                    <div style={styles.saveButton}>
                        <button type="submit" disabled={loading} style={{border:"1px solid #ccc"}}>Save</button>
                    </div>
                </div>
            </div>
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
        zIndex: 5000
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