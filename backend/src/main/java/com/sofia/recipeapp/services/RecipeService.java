package com.sofia.recipeapp.services;

import com.sofia.recipeapp.dto.IngredientDTO;
import com.sofia.recipeapp.dto.RecipeDTO;
import com.sofia.recipeapp.model.Recipe;
import com.sofia.recipeapp.model.RecipeIngredient;
import com.sofia.recipeapp.model.Tag;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.repository.RecipeRepository;
import com.sofia.recipeapp.repository.TagRepository;
import com.sofia.recipeapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
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


    /**
     * Gets a recipe by id
     * only if the recipe was created by a specific user
     * @param user updating user
     * @param id recipe id
     * @return recipe DTO
     * @throws ResponseStatusException when the recipe isn't created by specified user
     */
    public RecipeDTO getUsersRecipeById(User user, Long id) throws ResponseStatusException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with id " + id));
        if (!(recipe.getCreatedBy().getUsername().equals(user.getUsername()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return RecipeDTO.GetRecipeDTO(recipe, user);
    }

    /**
     * Deletes a recipe by id
     * only if the recipe was created by a specific user
     * @param user updating user
     * @param id recipe id
     * @throws ResponseStatusException when the recipe isn't created by specified user
     */
    public void deleteRecipe(User user, Long id) throws ResponseStatusException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with id " + id));

        if (!(recipe.getCreatedBy().getUsername().equals(user.getUsername()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        userRepository.deleteRecipeFromFavorites(id);
        recipeRepository.deleteById(id);
    }

    /**
     * Updates a recipe in db
     * 1. find the recipe
     * 2. update title, description and instructions
     * 3. update ingredients
     *  - update existing ingredients
     *  - add new ingredients
     *  - set ingredient
     *  - add to list of updated
     *  - remove ingredients not in updated
     *  - add ingredients from updated
     * @param updatedRecipe updated recipe
     * @param user updating user
     * @throws ResponseStatusException when the recipe isn't created by specified user
     */
    @Transactional
    public void updateRecipe(RecipeDTO updatedRecipe, User user) throws ResponseStatusException {
        // Find recipe in db
        Recipe recipe = recipeRepository.findById(updatedRecipe.getId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        if (!(recipe.getCreatedBy().getUsername().equals(user.getUsername()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        // Update recipe title, description and instructions
        recipe.setTitle(updatedRecipe.getTitle());
        recipe.setDescription(updatedRecipe.getDescription());
        recipe.setInstructions(updatedRecipe.getInstructions());

        // Updated ingredients list
        List<RecipeIngredient> updatedIngredients = new ArrayList<>();

        // For each updated recipe ingredient
        for (IngredientDTO dto : updatedRecipe.getIngredients()) {
            RecipeIngredient ingredient = null;

            // When the ingredient already existed, set ingredient
            if (dto.getId() != null) {
                ingredient = recipe.getRecipeIngredients().stream()
                        .filter(i -> dto.getId().equals(i.getId()))
                        .findFirst()
                        .orElse(null);
            }

            // When new ingredient, create new, set recipe
            if (ingredient == null) {
                ingredient = new RecipeIngredient();
                ingredient.setRecipe(recipe);
            }

            // Update ingredient
            ingredient.setIngredientName(dto.getName());
            ingredient.setQuantity(dto.getQuantity());

            // Add to updated ingredients
            updatedIngredients.add(ingredient);
        }

        // Remove existing ingredients if not in updated
        recipe.getRecipeIngredients().removeIf(existing ->
                updatedIngredients.stream()
                        .noneMatch(updated -> existing.getId() != null &&
                                existing.getId().equals(updated.getId()))
        );

        // If recipe doesn't contain updated ingredient add it
        for (RecipeIngredient updated : updatedIngredients) {
            if (!recipe.getRecipeIngredients().contains(updated)) {
                recipe.getRecipeIngredients().add(updated);
            }
        }

        // Update tags
        Set<Tag> tags = tagRepository.findAllByNameIn(updatedRecipe.getTags());
        recipe.setTags(tags);

        recipeRepository.save(recipe);
    }

}

