import { useState, useEffect } from "react"
import { updateProject } from "../services/projectService"
import EditTaskModal from "./EditTaskModal"
import CreateTaskModal from "./CreateTaskModal"


function EditModal({edProject,onClose,onProjectEdited,projectTasks=[],onTaskUpdated}){
  
    const [projectName,setProjectName]=useState(edProject.name)
    const [projectDesc,setProjectDesc]=useState(edProject.desc)
    const [tasks,setTasks]=useState(projectTasks || [])

    // Sync tasks when projectTasks prop changes
    useEffect(() => {
        setTasks(projectTasks || []);
    }, [projectTasks]);
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(false)
    const [editTask,setEditTask]=useState(false)
    const [selectedTask,setSelectedTask]=useState(null);
    const [showCreateTaskModal,setShowCreateTaskModal]=useState(false)
    console.log(edProject);
    const projectId=edProject.projectId;

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
        setSelectedTask(t)
                        }

    function handleTaskUpdated(updatedTask){
      setTasks((prev)=>prev.map((t)=>(t.id===updatedTask.id?updatedTask:t)))
      onTaskUpdated?.(updatedTask)
      setSelectedTask(updatedTask)
    }

    function handleTaskCreation(newTask){
      setTasks((prev)=>[...prev,newTask])
    }

    return (
        <div id="home_root">
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
       
            <div style={styles.taskOverlay}> 
              <div style={styles.taskHeader}>
                <h3>Tasks</h3>
                <button 
                  type="button" 
                  onClick={() => setShowCreateTaskModal(true)} 
                  style={styles.addTaskButton}
                >
                  + Add Task
                </button>
              </div>
                {tasks && tasks.length > 0 ? (
                    tasks.map((t)=> (
                        <div style={styles.indiTask} key={t.id}> 
                        <label>Task Name</label>
                            <h1>{t.name}</h1>
                        <label>Task Description</label>
                            <p>{t.description}</p>
                            <button onClick={()=>updateEditTask(t)} style={styles.EditButton}>
                                Edit
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{color: '#999', fontStyle: 'italic'}}>No tasks yet</p>
                )}
            </div>
                {editTask && <EditTaskModal 
                    selectedTask={selectedTask}
                    onTaskUpdated={handleTaskUpdated}
                    onClose={() => setEditTask(false)}
                    />}


                    {showCreateTaskModal && <CreateTaskModal
                        projectId={projectId}
                        onClose={() => setShowCreateTaskModal(false)}
                        onTaskCreated={(newTask) => {
                            handleTaskCreation(newTask);
                            setShowCreateTaskModal(false);
                        }}
                    />}

        </div>
    </div>
  </div>);
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
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  addTaskButton: {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  indiTask: {
    padding: "12px",
    marginBottom: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },
  EditButton:{
    border:"1px solid #ccc",
    inset:"5px",
    padding:"5px 10px",
    backgroundColor:"#1976d2",
    color:"white",
    marginTop:"20px",
    cursor:"auto"
  }
}


export default EditModal
