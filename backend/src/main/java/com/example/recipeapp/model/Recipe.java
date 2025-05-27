package com.example.recipeapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Recipe Entity - id, title, description, instructions, User createdBy, RecipeIngredient ingredients, Set<Tag> tags (recipe_tag)
 * ManyToOne - User
 * OneToMany - RecipeIngredient
 * ManyToMany - Tag
 */
@Entity
@Table(name = "recipes")
@RequiredArgsConstructor
@Data
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String instructions;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnoreProperties("user_favorite_recipes")
    private User createdBy;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<RecipeIngredient> recipeIngredients = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "recipe_tag",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

}
