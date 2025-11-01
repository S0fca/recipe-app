package com.sofia.recipeapp.dto;

import com.sofia.recipeapp.model.RecipeIngredient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RecipeAdminDTO {
    private Long id;
    private String title;
    private String description;
    private String instructions;
    private List<RecipeIngredient> ingredients;
    private String createdByUsername;
}
