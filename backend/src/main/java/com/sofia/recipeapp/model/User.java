package com.sofia.recipeapp.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * User - id, username, password, Set-Recipe favoriteRecipes
 * ManyToMany - favoriteRecipes
 */
@Entity
@Table(name = "users")
@JsonIgnoreProperties({"recipes"})
@Data
@RequiredArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

//    @Email
//    @NotBlank
//    @Column(unique = true, nullable = false)
//    private String email;

    @Column(nullable = false)
    private String role;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_recipes",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "recipe_id")
    )
    private Set<Recipe> favoriteRecipes = new HashSet<>();

}
