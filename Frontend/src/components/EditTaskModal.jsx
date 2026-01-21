import { useState } from "react";
import { updateTask } from "../services/taskService";
import { updateProject } from "../services/projectService";

function EditTaskModal({selectedTask,onClose}){
    console.log(selectedTask)
    const [taskName,setTaskName]=useState(selectedTask.name);
    const [taskDesc,setTaskDesc]=useState(selectedTask.description);
    const [taskStatus,setTaskStatus]=useState(selectedTask.status);
    const [taskPriority,setTaskPriority]=useState(selectedTask.priority);
    const [taskDueDate,setTaskDueDate]=useState(selectedTask.date);
    const taskDTO={taskName,taskDesc,taskStatus,taskPriority,taskDueDate}
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)

    async function submitTask(e){
        e.preventDefault();
        try{
            setLoading(true)
        const updatedTask=await updateTask(selectedTask.id,taskDTO)
        console.log(updatedTask)
        }
        catch(ex){
            setError(ex.message)
        }
        finally{
           
            setLoading(false)
            onClose()
        }
    }


    return (
            <div id="root">
            {(error)? (<p style={{color:"red"}}>{error}</p>):

 (               <div style={styles.modalOverlay}>
                    <div onClick={()=>onClose()} style={styles.modalBackdrop}/>
                        <div style={styles.modalContent}>
                    <form onSubmit={submitTask}>
                        <label>Task Name</label>
                        <div style={styles.formGroup}>                       
                        <input 
                        type="text"
                        value={taskName}
                        onChange={(e)=>setTaskName(e.target.value)}
                        required
                        />
                        </div>

                        <label>Task Desc</label>
                        <div style={styles.formGroup}>
                        <input 
                        type="text"
                        value={taskDesc}
                        onChange={(e)=>setTaskDesc(e.target.value)}
                        required
                        />
                    </div>

                    <div style={styles.formRow}>
                        <label>Task Priority</label>
                        <select 
                        value={taskPriority}
                        onChange={(e)=>setTaskPriority(e.target.value)}
                        required
                        >
                            <option value="NEW">NEW</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="BLOCKED">BLOCKED</option>
                            </select>
                    </div>

                    <div style={styles.formRow}>
                    
                        <label>Task Status</label>
                        <input 
                        value={taskStatus}
                        onChange={(e)=>setTaskStatus(e.target.value)}
                        required
                        />
                    </div>

                    <div style={styles.formRow}>
                        <label>Task Due Date</label>
                        <input 
                        value={taskDueDate}
                        onChange={(e)=>setTaskDueDate(e.target.value)}
                        
                        />
                    </div>

                    <button type="submit" style={styles.submitButton}>Submit</button>
                    </form>
                    </div>
                    
                </div>)
}
</div>
)}
       

const styles={
     
  modalOverlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,  
             // higher than EditModal (1001)
  },
  modalBackdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    zIndex: 2001,

    },
    submitButton: {padding: "8px 14px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    cursor: "pointer"},

    formGroup:{
        border:"1px solid #000000",
        

    }
}


export default EditTaskModal;
