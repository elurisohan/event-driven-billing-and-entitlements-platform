package com.tracknote.service;

import com.tracknote.dao.ProjectRepository;
import com.tracknote.dao.SubscriptionRepository;
import com.tracknote.dao.TaskRepository;
import com.tracknote.dao.UserRepository;
import com.tracknote.exception.LimitExceededException;
import com.tracknote.exception.UserNotFoundException;
import com.tracknote.model.Subscription;
import com.tracknote.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LimitEnforcement {
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public void projectLimit(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        Subscription sub = subscriptionRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Subscription not found for user " + username));

        int project_count = projectRepository.countByOwnerUsername(username);

        Integer limit = sub.getPlan().getMaxProjects();
        if (limit==null){
            return;
        }

        if (project_count>=limit){
            throw new LimitExceededException(
                    String.format("Limit Exceeded! You currently created '%s' projects ", project_count));
        }

    }

    public void taskLimit(int projectId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        Subscription sub = subscriptionRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Subscription not found for user " + username));

        int task_count = taskRepository.countByProjectId(projectId);

        Integer limit = sub.getPlan().getMaxTasksPerProject();
        if (limit==null){
            return;
        }

        if (task_count>=limit){
            throw new LimitExceededException(
                    String.format("Limit Exceeded! You currently created '%s' tasks in this project ", task_count));
        }

    }



}


