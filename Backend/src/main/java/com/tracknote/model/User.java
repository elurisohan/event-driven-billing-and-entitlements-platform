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

    private String email;

    private String password;

    @Column(unique = true)
    private String stripeCustomerId;

    @OneToOne(mappedBy ="user" ,cascade = CascadeType.ALL)
    private Subscription subscription;


    @OneToMany(mappedBy = "owner",cascade = CascadeType.ALL,orphanRemoval = true)
    @Builder.Default
    private List<Project> ownedProject= new ArrayList<>();

    @ManyToMany(mappedBy = "sharedUsers")
    @Builder.Default
    private Set<Project> sharedProjects=new HashSet<>();
}
