package com.tracknote.dao;


import com.tracknote.model.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Integer> {


     List<Project> findAllByOwnerUsername(String username);

    @EntityGraph(attributePaths = {"tasks"})
     List<Project> findBySharedUsersUsername(String username);
        /*
    PA normally loads Project and leaves project.getTasks() as lazy, so when you iterate project.getTasks() for N projects you can hit the N+1 query problem.
With @EntityGraph(attributePaths = {"tasks"}), JPA/Hibernate generates a query that joins Project with tasks, fetching both in one go and marking tasks as initialized
    */

     void deleteById(int id);

     int countByOwnerUsername(String username);


}
