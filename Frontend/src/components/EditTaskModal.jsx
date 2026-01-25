import { useState } from "react";
import { updateTask } from "../services/taskService";

function EditTaskModal({selectedTask,onClose,onTaskUpdated}){
    console.log(selectedTask)
    const [name,setName]=useState(selectedTask.name);
    const [description,setDescription]=useState(selectedTask.description);
    const [status,setStatus]=useState(selectedTask.status);
    const [priority,setPriority]=useState(selectedTask.priority);
    const [dueDate,setDueDate]=useState(selectedTask.date);
    const taskDTO={name,description,status,priority,dueDate}
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)

    async function submitTask(e){
        e.preventDefault();
        try{
            setLoading(true)
        const updatedTask=await updateTask(selectedTask.id,taskDTO)
        onTaskUpdated?.(updatedTask)
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
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        required
                        />
                        </div>

                        <label>Task Desc</label>
                        <div style={styles.formGroup}>
                        <input 
                        type="text"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        required
                        />
                    </div>

                    <div style={styles.formRow}>
                        <label>Task Priority</label>
                        <select 
                        value={priority}
                        onChange={(e)=>setPriority(e.target.value)}
                        required
                        >
                            <option value="NEW">NEW</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="DONE">COMPLETED</option>
                               
                            </select>
                    </div>

                    <div style={styles.formRow}>
                    
                        <label>Task Status</label>
                        <select 
                        value={status}
                        onChange={(e)=>setStatus(e.target.value)}
                        required
                        >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div style={styles.formRow}>
                        <label>Task Due Date</label>
                        <input 
                        type="date"
                        value={dueDate}
                        onChange={(e)=>setDueDate(e.target.value)}
                        
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
