package com.example.recipeapp.dto;

import com.example.recipeapp.model.Recipe;
import com.example.recipeapp.model.Tag;
import com.example.recipeapp.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * RecipeDTO - id, title, description, instructions, List-IngredientDTO ingredients, String createdByUsername, tags, isFavourite
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RecipeDTO {

    private Long id;
    private String title;
    private String description;
    private String instructions;
    private List<IngredientDTO> ingredients;
    private String createdByUsername;
    private List<String> tags;
    private boolean isFavourite;

    public static RecipeDTO GetRecipeDTO(Recipe recipe, User user) {
        RecipeDTO dto = new RecipeDTO();

        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setDescription(recipe.getDescription());
        dto.setInstructions(recipe.getInstructions());
        dto.setCreatedByUsername(recipe.getCreatedBy().getUsername());

        dto.setIngredients( //RecipeIngredients -> IngredientDTO

                recipe.getRecipeIngredients().stream()
                        .map(ri -> new IngredientDTO(ri.getId(), ri.getIngredientName(), ri.getQuantity()))
                        .toList()
        );

        dto.setTags(recipe.getTags().stream().map(Tag::getName).toList());

        if (user != null) {
            dto.setFavourite(user.getFavoriteRecipes().contains(recipe));
        } else {
            dto.setFavourite(false);
        }

        return dto;
    }
}
