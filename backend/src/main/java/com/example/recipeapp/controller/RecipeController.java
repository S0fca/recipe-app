package com.example.recipeapp.controller;

import com.example.recipeapp.dto.IngredientDTO;
import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.model.Ingredient;
import com.example.recipeapp.model.Recipe;
import com.example.recipeapp.model.Tag;
import com.example.recipeapp.repository.RecipeRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.yaml.snakeyaml.tokens.Token.ID.Tag;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeRepository recipeRepository;

    public RecipeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping
    public List<RecipeDTO> getAllRecipes() {
        return recipeRepository.findAll().stream().map(recipe -> {
            RecipeDTO dto = new RecipeDTO();
            dto.setId(recipe.getId());
            dto.setTitle(recipe.getTitle());
            dto.setDescription(recipe.getDescription());
            dto.setInstructions(recipe.getInstructions());
            dto.setCreatedByUsername(recipe.getCreatedBy().getUsername());
            dto.setIngredients(
                    recipe.getRecipeIngredients().stream()
                            .map(ri -> {
                                IngredientDTO ingredient = new IngredientDTO();
                                ingredient.setId(ri.getIngredient().getId());
                                ingredient.setName(ri.getIngredient().getName());
                                ingredient.setQuantity(ri.getQuantity());
                                return ingredient;
                            })
                            .collect(Collectors.toList())
            );
            dto.setTags(recipe.getTags().stream().map(com.example.recipeapp.model.Tag::getName).toList());
            return dto;
        }).toList();
    }
}
