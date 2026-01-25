import { useEffect, useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { createProject } from "../services/projectService";
import { getTasksByProject } from "../services/taskService";

export default function CreateModal({ onClose, onProjectCreated }) {
    const [projectId, setProjectId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projectCreated, setProjectCreated] = useState(false);
    const [createdProject, setCreatedProject] = useState(null);

   



    async function handleCreateProject(e) {
        e.preventDefault();  // ✅ Prevent form auto-submit
        setLoading(true);
        setError(null);

        try {
            const createdProj = await createProject({ name, description });
            setProjectId(createdProj.projectId);  
            setProjectCreated(true);
            setCreatedProject(createdProj);
        } catch (err) {
            setError(err.message || "Failed to create project");
        } finally {
            setLoading(false);
        }
    }

  
    function removeTasks(taskId) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));  // ✅ Fixed filter
    }

    function handleFinish() {
        const projWTask = { ...createdProject, tasks: tasks };
        onProjectCreated(projWTask);
        onClose();
    }

    function handleTaskCreated(newTask){
        setTasks((prev) => [...prev, newTask]);
    }

    console.log(projectId)
    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                
                {!projectCreated ? (
                    <>
                        <h2>Create Project</h2>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        
                        <form onSubmit={handleCreateProject}>  {/* ✅ No parentheses! */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Project Name *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Project name"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Project Description *</label>
                                <textarea
                                    style={styles.textarea}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Project Description"
                                    required
                                />
                            </div>

                            <div style={styles.buttonGroup}>
                                <button type="button" onClick={onClose} style={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} style={styles.submitButton}>
                                    {loading ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div style={styles.successMessage}>
                            <h2>✓ Project Created!</h2>
                            <p>"{name}" has been created successfully.</p>
                            
                        </div>


                        
                        {/* Task Management Section */}
                        <div style={styles.tasksSection}>
                            <div style={styles.tasksSectionHeader}>
                                <h3>Add Tasks (Optional)</h3>
                                <button 
                                    type="button"
                                    onClick={() => {
        setShowCreateTaskModal(true)}  }
                                    style={styles.addTaskButton}
                                >
                                    + Add Task
                                </button>
                            </div>

                            {/* Display Added Tasks */}
                            {tasks.length > 0 ? (
                                <div style={styles.tasksList}>
                                    <p style={styles.tasksCount}>{tasks.length} task(s) added</p>
                                    {tasks.map((task) => (  // ✅ Implicit return with ()
                                        <div key={task.id} style={styles.taskItem}>
                                            <div style={styles.taskItemHeader}>
                                                <strong>{task.name}</strong>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTasks(task.id)}  
                                                    style={styles.removeButton}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <p style={styles.taskItemDesc}>{task.description}</p>
                                            <div style={styles.taskItemDetails}>
                                                <span>Status: {task.status}</span>
                                                <span>Priority: {task.priority}</span>
                                                {task.dueDate && <span>Due: {task.dueDate}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={styles.noTasksYet}>No tasks added yet</p>
                            )}
                        </div>

                        {/* Finish Button */}
                        <div style={styles.buttonGroup}>
                            <button 
                                type="button"
                                onClick={handleFinish}  
                                style={styles.submitButton}
                            >
                                {tasks.length > 0 ? "Finish & Add Tasks" : "Finish"}
                            </button>
                        </div>
                    </>
                )}

                {/* Task Modal */}
                {showCreateTaskModal && projectId && (
                    <CreateTaskModal
                        projectId={projectId}
                        onClose={() => setShowCreateTaskModal(false)}
                        onTaskCreated={handleTaskCreated}
                        
                        
                    />
                )}
            </div>
        </div>
    );
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
    successMessage: {
        color: '#4CAF50',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    formGroup: {
        marginBottom: '15px'
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
    tasksSection: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
    },
    tasksSectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    addTaskButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    submitButton:{
        border:"1px solid #ccc",
        padding:"10px",
        borderRadius:"20px",
        
    }
    ,
    tasksCount: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '10px'
    },
    tasksList: {
        marginTop: '10px'
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
    noTasksYet: {
        color: '#999',
        fontStyle: 'italic',
        fontSize: '14px'
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
    }
}
