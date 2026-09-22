import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../services/projectService';
import { queryKeys } from '../queryKeys';

export default function DeleteModal({ project, onClose }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(project.projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.removeQueries({ queryKey: queryKeys.tasks(project.projectId) });
      onClose();
    },
  });

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Delete Project</h2>

        {deleteMutation.isError && (
          <p style={{ color: 'red' }}>
            {deleteMutation.error?.message || 'Failed to delete Project'}
          </p>
        )}

        <p>
          Are you sure you want to delete the project{' '}
          <strong>&quot;{project.name}&quot;</strong>?
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          This action cannot be undone. All tasks in this project will also be
          deleted.
        </p>

        <div style={styles.buttonGroup}>
          <button
            onClick={onClose}
            style={styles.cancelButton}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            style={styles.deleteButton}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '450px',
    width: '90%',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '25px',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#f44336',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
