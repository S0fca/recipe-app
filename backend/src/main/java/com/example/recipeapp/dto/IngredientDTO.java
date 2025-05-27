package com.example.recipeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * IngredientDTO - id, ingredient, quantity
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class IngredientDTO {

    private Long id;
    private String ingredient;
    private String quantity;

}
