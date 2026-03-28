package com.tracknote.dao;

import com.tracknote.model.Status;
import com.tracknote.model.Task;
import com.tracknote.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Integer> {
    Page<Task> findByStatus(Status status, Pageable pageable);
    Page<Task> findByStatusAndProjectId(Status status, int projectId, Pageable pageable);
    Page<Task> findByProjectId(int projectId, Pageable pageable);
    List<Task> findByProjectId(int projectId); // for non-paginated version
    int countByProjectId(int projectId);



}
