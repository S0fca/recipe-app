package com.sofia.recipeapp.services;

import com.sofia.recipeapp.dto.IngredientDTO;
import com.sofia.recipeapp.dto.RecipeAdminDTO;
import com.sofia.recipeapp.dto.RecipeDTO;
import com.sofia.recipeapp.exception.ApiException;
import com.sofia.recipeapp.model.Recipe;
import com.sofia.recipeapp.model.RecipeIngredient;
import com.sofia.recipeapp.model.Tag;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.repository.RecipeRepository;
import com.sofia.recipeapp.repository.TagRepository;
import com.sofia.recipeapp.repository.UserRepository;
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
     * @throws ApiException recipe not found exception
     */
    private Recipe getRecipeById(Long recipeId) throws ApiException {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ApiException("Recipe not found", HttpStatus.NOT_FOUND));
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
     * @param id recipe id
     * @return recipe DTO
     * @throws ApiException when the recipe isn't created by specified user (403)
     *                      or when recipe doesn't exist (404)
     */
    public RecipeDTO getRecipeDTOById(Long id, Long userId) throws ApiException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "Recipe not found with id " + id,
                        HttpStatus.NOT_FOUND
                ));
        User authUser = userRepository.getReferenceById(userId);

        return RecipeDTO.GetRecipeDTO(recipe, authUser);
    }

    /**
     * Deletes a recipe by id
     * only if the recipe was created by a specific user
     * @param user updating user
     * @param id recipe id
     * @throws ApiException when the recipe isn't created by specified user (403)
     *                      or when recipe doesn't exist (404)
     */
    public void deleteRecipe(User user, Long id) throws ApiException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "Recipe not found with id " + id,
                        HttpStatus.NOT_FOUND
                ));

        if (!(recipe.getCreatedBy().getUsername().equals(user.getUsername()))) {
            throw new ApiException("This recipe wasn't created by this user", HttpStatus.FORBIDDEN);
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
     * @param username updating user name
     * @throws ResponseStatusException when the recipe isn't created by specified user
     */
    @Transactional
    public void updateRecipe(RecipeDTO updatedRecipe, String username) throws ResponseStatusException {
        Recipe recipe = recipeRepository.findById(updatedRecipe.getId())
                .orElseThrow(() -> new ApiException(
                        "Recipe not found with id " + updatedRecipe.getId(),
                        HttpStatus.NOT_FOUND
                ));

        if (!(recipe.getCreatedBy().getUsername().equals(username))) {
            throw new ApiException("This recipe wasn't created by this user", HttpStatus.FORBIDDEN);
        }

        recipe.setTitle(updatedRecipe.getTitle());
        recipe.setDescription(updatedRecipe.getDescription());
        recipe.setInstructions(updatedRecipe.getInstructions());

        List<RecipeIngredient> updatedIngredients = new ArrayList<>();

        for (IngredientDTO dto : updatedRecipe.getIngredients()) {
            RecipeIngredient ingredient = null;

            if (dto.getId() != null) {
                ingredient = recipe.getRecipeIngredients().stream()
                        .filter(i -> dto.getId().equals(i.getId()))
                        .findFirst()
                        .orElse(null);
            }

            if (ingredient == null) {
                ingredient = new RecipeIngredient();
                ingredient.setRecipe(recipe);
            }

            ingredient.setIngredientName(dto.getName());
            ingredient.setQuantity(dto.getQuantity());

            updatedIngredients.add(ingredient);
        }

        recipe.getRecipeIngredients().removeIf(existing ->
                updatedIngredients.stream()
                        .noneMatch(updated -> existing.getId() != null &&
                                existing.getId().equals(updated.getId()))
        );

        for (RecipeIngredient updated : updatedIngredients) {
            if (!recipe.getRecipeIngredients().contains(updated)) {
                recipe.getRecipeIngredients().add(updated);
            }
        }

        Set<Tag> tags = tagRepository.findAllByNameIn(updatedRecipe.getTags());
        recipe.setTags(tags);

        recipeRepository.save(recipe);
    }

    public void deleteRecipeAsAdmin(Long id) {
        recipeRepository.findById(id)
                .orElseThrow(() -> new ApiException("Recipe not found", HttpStatus.NOT_FOUND));

        userRepository.deleteRecipeFromFavorites(id);
        recipeRepository.deleteById(id);
    }


    public List<RecipeDTO> getAllRecipesForUser(User user) {
        return recipeRepository.findAll().stream()
                .map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user))
                .toList();
    }

    public List<RecipeAdminDTO> getAllRecipesAsAdmin() {
        return recipeRepository.findAll().stream()
                .map(r -> new RecipeAdminDTO(
                        r.getId(),
                        r.getTitle(),
                        r.getDescription(),
                        r.getInstructions(),
                        r.getRecipeIngredients(),
                        r.getCreatedBy().getUsername()
                ))
                .collect(Collectors.toList());
    }

    public List<RecipeDTO> getRecipesByUser(User user) {
        return recipeRepository.findByCreatedByUsername(user.getUsername()).stream()
                .map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user))
                .toList();
    }
}

