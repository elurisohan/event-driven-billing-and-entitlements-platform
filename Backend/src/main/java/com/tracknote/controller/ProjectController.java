package com.tracknote.controller;

import com.tracknote.Jwtutil;
import com.tracknote.dto.ProjectDTO;
import com.tracknote.dto.ProjectResponseDTO;
import com.tracknote.model.User;
import com.tracknote.service.LimitEnforcement;
import com.tracknote.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping(value="/api/v1/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;
    private final Jwtutil jwtutil;
    private final LimitEnforcement limitEnforcement;

    //create
    @PostMapping("/")
    public ResponseEntity<?> createProject(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody ProjectDTO dto){//should I declare exception here as well or is it not needed because I did inside already
        String username=userDetails.getUsername();
        limitEnforcement.projectLimit(username);
        return ResponseEntity.ok(projectService.createProject(username,dto));
    }

    @GetMapping("/")
    public ResponseEntity<?> getProjectByUser(@AuthenticationPrincipal UserDetails userDetails){
        String username=userDetails.getUsername();
        //API will only return 200 OK when the service method succeeds, and you'll get custom error status codes for failures. You xan use .ok method because even if there's an issue, exception handler will handle it
        return ResponseEntity.ok(projectService.getProjectByUser(username));
    }

    //Note: Method overloading is not an issue across different classes.
    @PatchMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@AuthenticationPrincipal UserDetails userDetails, @PathVariable int projectId, @RequestBody ProjectDTO updatedProject){
        String username=userDetails.getUsername();
        return ResponseEntity.ok(projectService.updateProject(username,projectId,updatedProject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable int id, @AuthenticationPrincipal UserDetails userDetails){
        String username=userDetails.getUsername();
        projectService.deleteProject(id,username);
        return ResponseEntity.noContent().build();
    }
}

