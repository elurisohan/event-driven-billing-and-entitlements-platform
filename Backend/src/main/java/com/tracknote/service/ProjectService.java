package com.tracknote.service;
import com.tracknote.dao.ProjectRepository;
import com.tracknote.dao.TaskRepository;
import com.tracknote.dao.UserRepository;
import com.tracknote.dto.ProjectDTO;
import com.tracknote.dto.ProjectResponseDTO;
import com.tracknote.exception.ProjectDeletionException;
import com.tracknote.exception.ProjectNotFoundException;
import com.tracknote.exception.UnauthorizedException;
import com.tracknote.exception.UserNotFoundException;
import com.tracknote.model.Project;
import com.tracknote.model.Task;
import com.tracknote.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProjectService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final DTOMapper dtoMapper;


    public ProjectResponseDTO createProject(String username, ProjectDTO project){
        User usr=getUserByUsername(username);
        Project project1=Project.builder().name(project.getName()).description(project.getDescription())
                .tasks(new ArrayList<>()).owner(usr).build();// creates a new instance of your Project entity. Why create a new instance here? Entities represent rows in your database. You need an actual Project object to save a new project record.This object is used by Hibernate/JPA to know what data should be persisted in the database.
        Project savedProject= projectRepository.save(project1);
        return dtoMapper.toProjectResponse(savedProject);
    }

    public List<ProjectResponseDTO> getProjectByUser(String username){
        //User username=getUserByUsername(username);
        return projectRepository.findAllByOwnerUsername(username)
                .stream()
                .map(dtoMapper::toProjectResponse)//method reference. 2 types of syntax - classname::method | object::instancemethod
                .collect(Collectors.toList());
        /*Diff bw toList() terminal method and collect(Collectors.toList()) method is that the initial method gives an immutable list while the later gives a mutable list. */
    }

    public List<Project> getProjectBySharedUsers(String username){
        User usr=getUserByUsername(username);
        return projectRepository.findBySharedUsersUsername(username);
    }

    public ProjectResponseDTO updateProject( String username,int id, ProjectDTO updatedProject ) {
        //Veri
        Project proj = getProject(id);
        if (!proj.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("User " + username + " not authorized to update this project.");
        }
        else {
            Optional.ofNullable(updatedProject.getName()).ifPresent(proj::setName);
            Optional.ofNullable(updatedProject.getDescription()).ifPresent(proj::setDescription);
            projectRepository.save(proj);
            return dtoMapper.toProjectResponse(proj);
        }
    }


    public void deleteProject(int id, String username){
        Project project=getProject(id);
        //even after the project exist and user is the correct owner, if there is any other error. I want to log that properly.
        if (!project.getOwner().getUsername().equals(username)){
            throw new UnauthorizedException("User "+username+" not authorized to delete this project.");
        }
        try {
            projectRepository.deleteById(id);
        } catch(Exception ex){
            throw new ProjectDeletionException("Failed to delete Project "+id,ex);
        }
        }

    public User getUserByUsername(String username){
        return userRepository.findByUsername(username).orElseThrow(()->new UserNotFoundException(username));
    }

    public Project getProject(int id){
        return projectRepository.findById(id).orElseThrow(()->new ProjectNotFoundException(id));

    }
}
