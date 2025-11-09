package com.sofia.recipeapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * RecipeIngredient - id, ingredientName, quantity, recipe
 * ManyToOne - Recipe
 */
@Entity
@JsonIgnoreProperties({"recipe"})
@RequiredArgsConstructor
@Data
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ingredientName;

    private String quantity;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    @JsonIgnoreProperties("recipeIngredients")
    private Recipe recipe;

}
