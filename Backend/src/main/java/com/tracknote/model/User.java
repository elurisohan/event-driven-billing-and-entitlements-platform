package com.tracknote.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="users" )
@Builder
@ToString(exclude = "ownedProject")
public class User {

    @GeneratedValue
    @Id
    private int id;

    @Column(nullable = false,unique = true)
    private String username;

    private String fullname;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    private String email;

    private String password;

    @OneToOne(mappedBy ="user" ,cascade = CascadeType.ALL)
    private Subscription subscription;


    //By default, @ManyToOne is EAGER, so fetching Project usually loads User automatically.
    //@OneToMany is LAZY by default, so fetching User doesn’t load all projects unless you access the list.
    @OneToMany(mappedBy = "owner",cascade = CascadeType.ALL,orphanRemoval = true)
    @Builder.Default//prevents null pointer exception when we try to add without initializing.
    private List<Project> ownedProject= new ArrayList<>();
    //here the use of above line is to make it convenient for a user, to directly query owned projects from user side. If not, we'd have to manually query project table for all the owned peojects.


    @ManyToMany(mappedBy = "sharedUsers")
    @Builder.Default
    private Set<Project> sharedProjects=new HashSet<>();
}
