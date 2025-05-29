package com.example.recipeapp.services;

import com.example.recipeapp.dto.IngredientDTO;
import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.model.Recipe;
import com.example.recipeapp.model.RecipeIngredient;
import com.example.recipeapp.model.Tag;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.RecipeRepository;
import com.example.recipeapp.repository.TagRepository;
import com.example.recipeapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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

    public RecipeDTO getRecipe(User user, Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with id " + id));
        if (!(recipe.getCreatedBy().getUsername().equals(user.getUsername()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return RecipeDTO.GetRecipeDTO(recipe, user);
    }

    public void deleteRecipe(User user, Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found with id " + id));

        if (!(recipe.getCreatedBy().getUsername().equals(user.getUsername()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        recipeRepository.deleteById(id);
    }

    public void updateRecipe(RecipeDTO recipeDTO, User user) {
        Recipe recipe = recipeRepository.findById(recipeDTO.getId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        recipe.setTitle(recipeDTO.getTitle());
        recipe.setDescription(recipeDTO.getDescription());
        recipe.setInstructions(recipeDTO.getInstructions());
        recipe.setCreatedBy(user);

        List<RecipeIngredient> updatedIngredients = new ArrayList<>();

        for (IngredientDTO dto : recipeDTO.getIngredients()) {
            RecipeIngredient ingredient = null;

            if (dto.getId() != null) {
                ingredient = recipe.getRecipeIngredients().stream()
                        .filter(i -> dto.getId().equals(i.getId()))
                        .findFirst()
                        .orElse(null);
            }

            if (ingredient == null) {
                ingredient = new RecipeIngredient();
                ingredient.setRecipe(recipe); // důležité!
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

        Set<Tag> tags = tagRepository.findAllByNameIn(recipeDTO.getTags());
        recipe.setTags(tags);

        recipeRepository.save(recipe);
    }

}

