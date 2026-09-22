/** Central query keys so invalidation stays consistent across pages/modals. */
export const queryKeys = {
  projects: ['projects'],
  tasks: (projectId) => ['tasks', projectId],
  plans: ['plans'],
};
