import { useState } from "react"
import { updateProject } from "../services/projectService"
import EditTaskModal from "./EditTaskModal"

function EditModal({edProject,onClose,onProjectEdited}){
    const [projectName,setProjectName]=useState(edProject.name)
    const [projectDesc,setProjectDesc]=useState(edProject.desc)
    const [tasks,setTasks]=useState(edProject.tasks)
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(false)
    const [editTask,setEditTask]=useState(false)
    const [task,setTask]=useState(null);

    async function handleUpdateProject(e){
        e.preventDefault()
        setLoading(true)
        setError(false)
        try{
            const upProj=await updateProject(edProject.projectId,{name:projectName,description:projectDesc})
            onProjectEdited(upProj)
            onClose()
        }
        catch(err){
            setError(err.message|| "failed to update project")
        }
        finally{
            setLoading(false)
            
        }
    }

    function updateEditTask(t){
        setEditTask(true)
        setTask(t)
                        }

    return (

        <div style={styles.modalOverlay}>
            <div style={styles.modalBackdrop} onClick={onClose} />
                <div style={styles.modalContent}>
                    <h2 style={styles.title}>Edit Project</h2>

                    {error && <p style={{color:"red"}}>{error}</p>}

        <form onSubmit={handleUpdateProject}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Project Title</label>
                <input
                style={styles.input}
                type="text"
                value={projectName}
                onChange={(e)=>setProjectName(e.target.value)}
                required
                />
</div>
             <div style={styles.formGroup}>
                <label style={styles.label}>Project Description</label>
                <input
                style={styles.input}
                type="text"
                value={projectDesc}
                onChange={(e)=>setProjectDesc(e.target.value)}
                required
                />
      </div>      
         <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Project"}
            </button>
        </div>
        </form>

            <div style={styles.taskOverlay} >
                {tasks.map((t)=> (
                    <div style={styles.indiTask} key={t.id}> 
                        <h1>{t.name}</h1>
                        <p>{t.desc}</p>
                        <button onClick={()=>updateEditTask(t)}>
                            Edit
                        </button>
                    </div>
                ))}
            </div>
                {editTask && <EditTaskModal 
                    uTask={task}
                    onClose={() => setEditTask(false)}
                    />}

        </div>
    </div>
  );
}

const styles= {
    modalOverlay: {
        position:'fixed',
        inset:0,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        zIndex:1000
    },
    modalBackdrop:{
        position:'absolute',
        inset:0,
        backgroundColor: "rgba(64, 64, 64, 0.4)"
    },
   modalContent: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1001,
  },
    
  title: {
    margin: "0 0 16px 0",
  },
  errorText: {
    color: "red",
    marginBottom: "12px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: 500,
  }, input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
    minHeight: "80px",
    resize: "vertical",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "8px",
  },
  cancelButton: {
    padding: "8px 14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    cursor: "pointer",
  },
  submitButton: {
    padding: "8px 14px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    cursor: "pointer",
  },
  taskOverlay: {
    marginTop: "20px",
  },
  indiTask: {
    padding: "12px",
    marginBottom: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  }
}


export default EditModal