package com.example.recipeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * IngredientDTO - id, name, quantity
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class IngredientDTO {

    private Long id;
    private String name;
    private String quantity;

}
