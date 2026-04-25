package com.tracknote.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Data //getter setter methods, toString and equal to methods
@Entity // to tell JPA that this class should be mapped to a table in DB . By default the class name is assumed to be the table name
@Table(name="project", uniqueConstraints = @UniqueConstraint(columnNames = {"owner_id","name"})) // Only if we want to change schema , unique ocnstraints, and table name change
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "tasks")//field name you want to exclude to avoid stack overflow error
@Builder
//this was important because every class needs to have a NoArgsConstrcutor for Hibernate/JPA
/*Why does Hibernate (JPA) need a no-argument constructor?
Hibernate needs a no-argument constructor for each of your entity classes (like Project) because of how it works internally:

Object creation via reflection: When Hibernate reads data from the database, it needs to create ("instantiate") an object of your entity class. It does this without using the usual new keyword, but instead by calling the no-argument constructor through Java reflection.

Population in multiple steps: Hibernate first creates an empty entity instance (just with the no-arg constructor), and after that, it sets each entity field using reflection or property setters.

This is required because, at the moment of object creation, Hibernate doesn't have all the field values—it gets them one by one from the database row.*/
public class Project {

    @GeneratedValue
    @Id
    private int id;

    @Column( nullable = false) //Here adding constrabt as unique=True would be a global constraint. Which is the reason, to keep it limited to the table, mention it in the table annotation.
    private String name;

    private String description;

    /*
    The following is an old way of building used for Java 8 prior classes.
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

     @PrePersist
    protected void onCreate(){
        createdAt=new Date();
    }
    //Use @Builder.Default annotation here, This tells Lombok's builder: use these as defaults unless the builder overrides them.
Lombok emits a warning in your error output:


"@Builder will ignore the initializing expression entirely. If you want the initializing expression to serve as default, add @Builder.Default."

This means your builder will NOT apply your default initializations (like new Date()) unless you annotate those fields with @Builder.Default.


 For Lombok's @Builder to work well with JPA entities, you should usually:

Add @NoArgsConstructor (MANDATORY for JPA)

Add @AllArgsConstructor or define your own constructor if necessary

Avoid or be careful with inline initialization of fields

Sometimes switch to a more explicit builder configuration if you want full control*/


    //In JPA/Hibernate, relationships between entities are represented by object references, not by primitive types like int.
    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name="owner_id")
    private User owner;

    @ManyToMany
    @JoinTable(name="project_shared_users",joinColumns =@JoinColumn(name="project_id"),inverseJoinColumns = @JoinColumn(name="user_id"))
    @Builder.Default
    private Set<User> sharedUsers=new HashSet<>();




    @OneToMany(mappedBy = "project",cascade = CascadeType.ALL,orphanRemoval = true)
    @Builder.Default
    private List<Task> tasks=new ArrayList<>();
}


/*collections is an interface
List, Set and  is an interface which extends it
Map is not exactly a collection extension. Because all these classes extend collections, they've few common methods .

List<?> obj=new HashList<>();
TreeList
HashList

Set
TreeSet
HashSet




 */