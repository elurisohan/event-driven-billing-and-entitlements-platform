package com.tracknote.service;

import com.tracknote.dto.ProjectResponseDTO;
import com.tracknote.model.Project;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DTOMapperTest {
    @Test
    void testProjectWithNullTasksReturnsValidDTO() {
        // Arrange
        Project project = new Project();
        project.setId(1);
        project.setName("Demo");
        project.setDescription("Testing null tasks");
        project.setTasks(null);
        DTOMapper mapper = new DTOMapper();

        // Act
        ProjectResponseDTO dto = mapper.toProjectResponse(project);

        // Assert - DTOMapper handles null tasks and returns valid DTO
        assertNotNull(dto);
        assertEquals(1, dto.getProjectId());
        assertEquals("Demo", dto.getName());
        assertEquals("Testing null tasks", dto.getDesc());
    }
}