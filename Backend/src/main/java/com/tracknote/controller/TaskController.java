
package com.tracknote.controller;

import com.tracknote.dto.TaskDTO;
import com.tracknote.dto.TaskResponseDTO;
import com.tracknote.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponseDTO> createTask(
            @PathVariable int projectId,
            @RequestBody @Valid TaskDTO taskDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        TaskResponseDTO created = taskService.createTask(projectId, taskDTO, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByProject(
            @PathVariable int projectId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        List<TaskResponseDTO> tasks = taskService.getTasksByProject(projectId, username);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponseDTO> getTask(
            @PathVariable int taskId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        TaskResponseDTO task = taskService.getTask(taskId, username);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable int taskId,
            @RequestBody TaskDTO taskDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        TaskResponseDTO updated = taskService.updateTask(taskId, taskDTO, username);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable int taskId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        taskService.deleteTask(taskId, username);
        return ResponseEntity.noContent().build();
    }
}
