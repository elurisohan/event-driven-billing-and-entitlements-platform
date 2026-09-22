                        import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { getProjects } from '../services/projectService';
import { getTasksByProject } from '../services/taskService';
import { queryKeys } from '../queryKeys';
import CreateModal from '../components/CreateModal';
import EditModal from '../components/EditModal';
import DeleteModal from '../components/DeleteModal';

const TASK_STATUS_STYLES = {
  NEW: { bg: '#e0f2fe', color: '#0369a1' },
  IN_PROGRESS: { bg: '#ffedd5', color: '#c2410c' },
  DONE: { bg: '#dcfce7', color: '#15803d' },
};

function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectsErr,
  } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: getProjects,
  });

  const taskQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: queryKeys.tasks(project.projectId),
      queryFn: () => getTasksByProject(project.projectId),
      enabled: !!project.projectId,
    })),
  });

  const projectTasks = Object.fromEntries(
    projects.map((project, index) => [
      project.projectId,
      taskQueries[index]?.data ?? [],
    ])
  );

  const tasksLoading = taskQueries.some((q) => q.isPending);
  const loading = projectsLoading || (projects.length > 0 && tasksLoading);
  const error = projectsError
    ? projectsErr?.message || 'Failed to load projects'
    : null;

  function openEditModal(project) {
    setSelectedProject(project);
    setShowEditModal(true);
  }

  function openDeleteModal(project) {
    setSelectedProject(project);
    setShowDeleteModal(true);
  }

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate('/login');
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={styles.statusMessage}>Loading projects…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <p style={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Projects</h1>
          <p style={styles.pageSubtitle}>
            {projects.length === 0
              ? 'No projects yet — create one to get started.'
              : `${projects.length} project${projects.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={styles.primaryButton}
          >
            + New project
          </button>
          <button type="button" onClick={handleLogout} style={styles.secondaryButton}>
            Logout
          </button>
        </div>
      </header>

      {projects.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>Your workspace is empty</p>
          <p style={styles.emptyText}>
            Create a project to organize tasks and track progress.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={styles.primaryButton}
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div style={styles.projectsGrid}>
          {projects.map((project) => {
            const tasks = projectTasks[project.projectId] || [];
            const completedCount = tasks.filter((t) => t.status === 'DONE').length;

            return (
              <article key={project.projectId} style={styles.projectCard}>
                <div style={styles.projectCardHeader}>
                  <div>
                    <h2 style={styles.projectName}>{project.name}</h2>
                    <p style={styles.projectMeta}>
                      {tasks.length} task{tasks.length === 1 ? '' : 's'}
                      {tasks.length > 0 && ` · ${completedCount} done`}
                    </p>
                  </div>
                  <div style={styles.projectActions}>
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      style={styles.ghostButton}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(project)}
                      style={styles.dangerGhostButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {project.desc && (
                  <p style={styles.projectDescription}>{project.desc}</p>
                )}

                {tasks.length > 0 ? (
                  <ul style={styles.tasksList}>
                    {tasks.map((task) => {
                      const statusStyle = TASK_STATUS_STYLES[task.status] || {
                        bg: '#f1f5f9',
                        color: '#475569',
                      };
                      return (
                        <li key={task.id} style={styles.taskItem}>
                          <div style={styles.taskRow}>
                            <span style={styles.taskName}>{task.name}</span>
                            <span
                              style={{
                                ...styles.taskBadge,
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                              }}
                            >
                              {task.status?.replace('_', ' ')}
                            </span>
                          </div>
                          {task.description && (
                            <p style={styles.taskDescription}>{task.description}</p>
                          )}
                          <div style={styles.taskMeta}>
                            <span>Priority: {task.priority}</span>
                            {task.dueDate && (
                              <span>
                                Due {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p style={styles.noTasks}>No tasks in this project yet.</p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateModal onClose={() => setShowCreateModal(false)} />
      )}

      {showEditModal && selectedProject && (
        <EditModal
          edProject={selectedProject}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
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
        />
      )}
    </div>
  );
}

export default Home;

const styles = {
  page: {
    flex: 1,
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px 48px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  pageTitle: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    margin: '6px 0 0',
    fontSize: '14px',
    color: '#64748b',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  primaryButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    background: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#334155',
    background: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  ghostButton: {
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#334155',
    background: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  dangerGhostButton: {
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#b91c1c',
    background: 'transparent',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  statusMessage: {
    fontSize: '14px',
    color: '#64748b',
  },
  errorMessage: {
    fontSize: '14px',
    color: '#b91c1c',
    padding: '12px 16px',
    background: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  emptyState: {
    textAlign: 'center',
    padding: '56px 24px',
    background: '#fff',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
  },
  emptyTitle: {
    margin: '0 0 8px',
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
  },
  emptyText: {
    margin: '0 0 20px',
    fontSize: '14px',
    color: '#64748b',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  projectCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
  },
  projectCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  projectName: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 600,
    color: '#0f172a',
  },
  projectMeta: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#94a3b8',
  },
  projectActions: {
    display: 'flex',
    gap: '6px',
    flexShrink: 0,
  },
  projectDescription: {
    margin: '0 0 16px',
    fontSize: '14px',
    lineHeight: 1.5,
    color: '#64748b',
  },
  tasksList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '16px',
  },
  taskItem: {
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #f1f5f9',
  },
  taskRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  taskName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1e293b',
  },
  taskBadge: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    padding: '3px 8px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
  },
  taskDescription: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.4,
  },
  taskMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '8px',
    fontSize: '12px',
    color: '#94a3b8',
  },
  noTasks: {
    margin: 0,
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
    fontSize: '13px',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
};


