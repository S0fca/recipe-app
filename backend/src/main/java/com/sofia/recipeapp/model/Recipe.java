package com.sofia.recipeapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Recipe Entity - id, title, description, instructions, User createdBy, RecipeIngredient ingredients, Set-Tag tags (recipe_tag)
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
    @Column(length = 100)
    private String title;
    private String description;
    @Column(columnDefinition = "TEXT")
    private String instructions;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnoreProperties({"recipesCreated", "favoriteRecipes"})
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User createdBy;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredient> recipeIngredients = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "recipe_tag",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany(mappedBy = "favoriteRecipes")
    @JsonIgnore
    private Set<User> usersWhoFavorited = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Recipe recipe)) return false;
        return id != null && id.equals(recipe.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
