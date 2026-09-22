import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../services/taskService.js';
import { queryKeys } from '../queryKeys';

function toDateInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export default function CreateTaskModal({ projectId, onClose, onTaskCreated }) {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('NEW');
  const [taskPriority, setTaskPriority] = useState('LOW');
  const [taskDueDate, setTaskDueDate] = useState('');
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (task) => createTask(projectId, task),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      onTaskCreated?.(newTask);
      onClose();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createTaskMutation.mutate({
      name: taskName,
      description: taskDescription,
      status: taskStatus,
      priority: taskPriority,
      dueDate: taskDueDate || null,
    });
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <form onSubmit={handleSubmit}>
          <div style={styles.tasksSection}>
            <h3>Add Task</h3>

            {createTaskMutation.isError && (
              <p style={{ color: 'red' }}>
                {createTaskMutation.error?.message || 'Failed to create task'}
              </p>
            )}

            <div style={styles.taskForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Task Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Task name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Task Description</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    style={styles.select}
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    style={styles.select}
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
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
                    value={toDateInputValue(taskDueDate)}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={onClose}
                  style={styles.cancelButton}
                  disabled={createTaskMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  style={styles.submitButton}
                >
                  {createTaskMutation.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </form>
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
    zIndex: 5000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  tasksSection: {
    marginTop: '25px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  taskForm: {
    marginTop: '15px',
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
  submitButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#2196F3',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
