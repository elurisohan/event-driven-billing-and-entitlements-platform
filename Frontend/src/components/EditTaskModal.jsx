import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import { queryKeys } from '../queryKeys';

function toDateInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function EditTaskModal({ selectedTask, onClose }) {
  const [name, setName] = useState(selectedTask.name ?? '');
  const [description, setDescription] = useState(selectedTask.description ?? '');
  const [status, setStatus] = useState(selectedTask.status ?? 'NEW');
  const [priority, setPriority] = useState(selectedTask.priority ?? 'LOW');
  const [dueDate, setDueDate] = useState(
    toDateInputValue(selectedTask.dueDate ?? selectedTask.date)
  );
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: (taskDTO) => updateTask(selectedTask.id, taskDTO),
    onSuccess: () => {
      const projectId = selectedTask.projectId;
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      } else {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
      onClose();
    },
  });

  function submitTask(e) {
    e.preventDefault();
    updateTaskMutation.mutate({
      name,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });
  }

  return (
    <div style={styles.modalOverlay}>
      <div onClick={onClose} style={styles.modalBackdrop} />
      <div style={styles.modalContent}>
        <h3 style={styles.title}>Edit Task</h3>

        {updateTaskMutation.isError && (
          <p style={{ color: 'red' }}>
            {updateTaskMutation.error?.message || 'Failed to update task'}
          </p>
        )}

        <form onSubmit={submitTask}>
          <label style={styles.label}>Task Name</label>
          <div style={styles.formGroup}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <label style={styles.label}>Task Description</label>
          <div style={styles.formGroup}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Task Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              style={styles.select}
            >
              <option value="NEW">NEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Task Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              style={styles.select}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Task Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={updateTaskMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={updateTaskMutation.isPending}
            >
              {updateTaskMutation.isPending ? 'Saving…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 2001,
    width: '90%',
    maxWidth: '420px',
  },
  title: {
    margin: '0 0 16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 500,
  },
  formGroup: {
    marginBottom: '12px',
  },
  formRow: {
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
  },
  cancelButton: {
    padding: '8px 14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '8px 14px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: 'white',
    cursor: 'pointer',
  },
};

export default EditTaskModal;
