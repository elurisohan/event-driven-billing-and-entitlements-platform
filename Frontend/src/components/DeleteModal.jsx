import { useState } from "react";
import api from "../api/axios";

export default function DeleteModal({project, onClose, onProjectDeleted}){
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(false)

    async function handleDelete(){
        setLoading(true);
        setError(false);

        try{
            await api.delete(`/projects/${project.projectId}`);
            onProjectDeleted(project.projectId);
            onClose();
        }
        catch(err){
            setError(err.message|| "Failed to delete Project")
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
        <h2>Delete Project</h2>

        {error && <p style={{color:"red"}}>{error}</p>}

        <p>Are you sure you want to delete the project <strong>"{project.name}"</strong>?</p>
        <p style={{color: '#666', fontSize: '14px'}}>This action cannot be undone. All tasks in this project will also be deleted.</p>

        <div style={styles.buttonGroup}>
            <button onClick={onClose} style={styles.cancelButton} disabled={loading}>Cancel</button>
            <button onClick={handleDelete} style={styles.deleteButton} disabled={loading}>
                {loading ? "Deleting..." : "Delete Project"}
            </button>
        </div>
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
        maxWidth: '450px',
        width: '90%'
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
    deleteButton: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#f44336',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px'
    }
}