import { getProjects } from "../services/projectService";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateModal from "../components/CreateModal";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import { getTasksByProject } from "../services/taskService";

//In Home, we maintain projects whole state, error anloading. we control various other components from here. 
//we have functinos which update the state

function Home(){
    const [projects, setProjects]  = useState([]);
    const [loading,setLoading] = useState(true);
    const [projectTasks,setProjectTasks]=useState({});
    const [error,setError] =useState(null);
    const [showCreateModal,setShowCreateModal]=useState(false);
    const [showEditModal,setShowEditModal]=useState(false);
    const [showDeleteModal,setShowDeleteModal]=useState(false);
    const [selectedProject,setSelectedProject]=useState(null);
    const {logout}=useContext(AuthContext);
    const navigate=useNavigate();

    useEffect(() => {
        async function loadProjects() {
            try {
                const proj = await getProjects();
                setProjects(proj);
                
                // Load tasks for all projects in parallel
                const tasksEntries = await Promise.all(
                    proj.map(async (p) => {
                        try {
                            const tasks = await getTasksByProject(p.projectId);
                            return [p.projectId, tasks];
                        } catch (err) {
                            console.error(`Failed to load tasks for project ${p.projectId}:`, err);
                            return [p.projectId, []]; // Return empty array on error
                        }
                    })
                );
                setProjectTasks(Object.fromEntries(tasksEntries));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadProjects();
    }, []);

    if (loading){
        return <p style={{padding:"20px"}}>Loading your data</p>
    }
    if (error){
        return <p style={{padding:"20px",color:"red"}}>{error}</p>
    }

    function handleCreateProject(newProject){
        setProjects((prev)=>[...prev,newProject])
    }

    function handleUpdateProject(updatedProject){
        setProjects((prev)=>prev.map(p=>p.projectId===updatedProject.projectId?updatedProject:p));
    }

    function handleDeleteProject(projectId) {
        setProjects((prev) => prev.filter(p => p.projectId !== projectId));
        // Remove tasks for deleted project
        setProjectTasks((prev) => {
            const updated = { ...prev };
            delete updated[projectId];
            return updated;
        });
    }
function handleTaskDeleted(taskId, projectId) {
        setProjectTasks((prev) => ({
            ...prev,
            [projectId]: (prev[projectId] || []).filter(t => t.id !== taskId)
        }));
    }

    
    function handleTaskCreated(newTask) {
        setProjectTasks((prev) => ({
            ...prev,
            [newTask.projectId]: [...(prev[newTask.projectId] || []), newTask]
        }));
    }

    function handleTaskUpdated(updatedTask) {
        setProjectTasks((prev) => ({
            ...prev,
            [updatedTask.projectId]: (prev[updatedTask.projectId] || []).map(t =>
                t.id === updatedTask.id ? updatedTask : t
            )
        }));
    }


    function openEditModal(project){
        setSelectedProject(project);
        setShowEditModal(true);
    }

    function openDeleteModal(project){
        setSelectedProject(project);
        setShowDeleteModal(true);
    }

    return (
        <div id="home_root" style={styles.home_root}>
        <h1>My Projects</h1>

        <div style={styles.headerButtons}>
            <button disabled>Profile</button>
            <button onClick={()=>setShowCreateModal(true)} style={styles.createButton}>+ New Project</button>
            <button
                style={styles.button}
                onClick={()=>{
                    logout ();
                    navigate('/login')
                }}>Logout</button>
        </div>
   
        {projects.length === 0 ? (
            <p>No projects</p>
        ) : (
            <div style={styles.projectsContainer}>
                {projects.map((project) => {
                    // Calculate tasks for this project (Option 4 pattern)
                    const tasks = projectTasks[project.projectId] || [];
                    
                    return (
                        <div key={project.projectId} style={styles.projectCard}>
                            <div style={styles.projectHeader}>
                                <strong style={styles.projectName}>{project.name}</strong>
                                <div style={styles.projectActions}>
                                    <button onClick={() => openEditModal(project)} style={styles.editButton}>
                                        Edit
                                    </button>
                                    <button onClick={() => openDeleteModal(project)} style={styles.deleteButton}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p style={styles.projectDescription}>{project.desc}</p>
                            
                            {/* Display Tasks */}
                            {tasks.length > 0 ? (
                                <div style={styles.tasksContainer}>
                                    <h4 style={styles.tasksTitle}>Tasks:</h4>
                                    <ul style={styles.tasksList}>
                                        {tasks.map((task) => (
                                            <li key={task.id} style={styles.taskItem}>
                                                <div style={styles.taskHeader}>
                                                    <span style={styles.taskName}>{task.name}</span>
                                                    <span style={{
                                                        ...styles.taskBadge,
                                                        backgroundColor: task.status === 'NEW' ? '#e3f2fd' :
                                                                       task.status === 'IN_PROGRESS' ? '#fff3e0' :
                                                                       task.status === 'COMPLETED' ? '#e8f5e9' : '#f3e5f5'
                                                    }}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <p style={styles.taskDescription}>{task.description}</p>
                                                <div style={styles.taskDetails}>
                                                    <span style={styles.taskPriority}>Priority: {task.priority}</span>
                                                    {task.dueDate && (
                                                        <span style={styles.taskDueDate}>
                                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p style={styles.noTasks}>No tasks yet</p>
                            )}
                        </div>
                    );
                })}
            </div>
        )}

        {showCreateModal && (
            <CreateModal
                onClose={() => setShowCreateModal(false)}
                onProjectCreated={(newproject) => handleCreateProject(newproject)}
                onTaskCreated={handleTaskCreated}
            />
        )}


        {showEditModal && selectedProject && (
            <EditModal
                edProject={selectedProject}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedProject(null);
                }}
                onProjectEdited={(editProject) => handleUpdateProject(editProject)}
                onTaskCreated={handleTaskCreated}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={(taskId) => handleTaskDeleted(taskId, selectedProject.projectId)}
                projectTasks={projectTasks[selectedProject.projectId] || []}
            />
        )}


        {showDeleteModal && selectedProject && (
            <DeleteModal
                project={selectedProject}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedProject(null);
                }}
                onProjectDeleted={(projectId) => {
                    handleDeleteProject(projectId);
                }}
            />
        )}

    </div>)
}
export default Home;

const styles={
    home_root:{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    headerButtons:{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        justifyContent: 'flex-end'
    },
    createButton:{
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    button:{
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    projectsContainer:{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    projectCard:{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    projectHeader:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    projectName:{
        fontSize: '1.2em',
        color: '#333'
    },
    projectActions:{
        display: 'flex',
        gap: '8px'
    },
    editButton:{
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        padding: '5px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9em'
    },
    deleteButton:{
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '5px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9em'
    },
    projectDescription:{
        color: '#666',
        marginBottom: '15px'
    },
    tasksContainer:{
        marginTop: '15px',
        borderTop: '1px solid #ddd',
        paddingTop: '15px'
    },
    tasksTitle:{
        margin: '0 0 10px 0',
        color: '#555'
    },
    tasksList:{
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    taskItem:{
        backgroundColor: 'white',
        padding: '12px',
        marginBottom: '8px',
        borderRadius: '5px',
        border: '1px solid #e0e0e0'
    },
    taskHeader:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px'
    },
    taskName:{
        fontWeight: '600',
        color: '#333'
    },
    taskBadge:{
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '0.8em',
        fontWeight: '500'
    },
    taskDescription:{
        margin: '5px 0',
        fontSize: '0.9em',
        color: '#666'
    },
    taskDetails:{
        display: 'flex',
        gap: '15px',
        fontSize: '0.85em',
        color: '#888',
        marginTop: '5px'
    },
    taskPriority:{
        fontWeight: '500'
    },
    taskDueDate:{
        color: '#666'
    },
    noTasks:{
        color: '#999',
        fontStyle: 'italic',
        marginTop: '10px'
    }
}


     /*   {showEditModal && selectedProject && (
        <EditModal
            project={selectedProject}
            onClose={()=>{
                setShowEditModal(false);
                setSelectedProject(null);
            }}
            onProjectUpdated={(updatedProject)=>{
                handleUpdateProject(updatedProject);
            }}
        />)}*/
