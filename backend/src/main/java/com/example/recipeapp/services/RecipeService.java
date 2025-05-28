package com.example.recipeapp.services;

import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.model.Recipe;
import com.example.recipeapp.model.RecipeIngredient;
import com.example.recipeapp.model.Tag;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.RecipeRepository;
import com.example.recipeapp.repository.TagRepository;
import com.example.recipeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final TagRepository tagRepository;

    /**
     * adds a recipe to user favourite recipes
     * @param user user
     * @param recipeId recipe id
     */
    public void addToFavourites(User user, Long recipeId) {
        Recipe recipe = getRecipeById(recipeId);

        if (!user.getFavoriteRecipes().contains(recipe)) {
            user.getFavoriteRecipes().add(recipe);
            userRepository.save(user);
        }
    }

    /**
     * removes a recipe from user favourites
     * @param user user
     * @param recipeId recipe id
     */
    public void removeFromFavourites(User user, Long recipeId) {
        Recipe recipe = getRecipeById(recipeId);

        if (user.getFavoriteRecipes().contains(recipe)) {
            user.getFavoriteRecipes().remove(recipe);
            userRepository.save(user);
        }
    }

    /**
     * RecipeDTO -> Recipe
     * adds a recipe to DB
     * @param recipeDTO recipe DTO to add
     * @param user user
     */
    public void addRecipe(RecipeDTO recipeDTO, User user) {
        Recipe recipe = new Recipe();
        recipe.setTitle(recipeDTO.getTitle());
        recipe.setDescription(recipeDTO.getDescription());
        recipe.setInstructions(recipeDTO.getInstructions());
        recipe.setCreatedBy(user);

        List<RecipeIngredient> recipeIngredients = recipeDTO.getIngredients().stream().map(ingredientDTO -> {
            RecipeIngredient ri = new RecipeIngredient();
            ri.setRecipe(recipe);
            ri.setQuantity(ingredientDTO.getQuantity());
            ri.setIngredientName(ingredientDTO.getName());
            return ri;
        }).toList();
        recipe.setRecipeIngredients(recipeIngredients);

        Set<Tag> tags = tagRepository.findAllByNameIn(recipeDTO.getTags());
        recipe.setTags(tags);

        recipeRepository.save(recipe);
    }

    /**
     * gets a recipe from recipe id
     * @param recipeId recipe id
     * @return Recipe
     */
    private Recipe getRecipeById(Long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found"));
    }

    public List<RecipeDTO> search(User user, String username, String title, List<String> tags) {

        List<Recipe> recipes = recipeRepository.search(
                username != null && !username.isBlank() ? username : null,
                title != null && !title.isBlank() ? title : null,
                tags != null && !tags.isEmpty() ? tags : null,
                tags != null && !tags.isEmpty() ? tags.size() : 0
        );
        return recipes.stream().map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user)).collect(Collectors.toList());

    }
}

