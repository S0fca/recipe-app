package com.sofia.recipeapp.controller;

import com.sofia.recipeapp.security.AuthenticatedUser;
import com.sofia.recipeapp.dto.RecipeDTO;
import com.sofia.recipeapp.exception.ApiException;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.repository.UserRepository;
import com.sofia.recipeapp.services.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final UserRepository userRepository;
    private final RecipeService recipeService;

    /**
     * gets all recipes
     * @param authentication authenticated user
     * @return HTTP 200 (OK) with a list of all recipes as DTOs
     */
    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<RecipeDTO> recipes = recipeService.getAllRecipesForUser(user);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Adds a new recipe to DB
     * @param recipeDTO recipe to add
     * @param authentication authenticated user
     * @return whether the recipe was added successfully
     */
    @PostMapping
    public ResponseEntity<?> addRecipe(@RequestBody RecipeDTO recipeDTO, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        recipeService.addRecipe(recipeDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Recipe created successfully");
    }

    /**
     * gets recipes created by authenticated user
     * @param authentication authenticated user
     * @return HTTP 200 (OK) with a list of users recipes as DTOs
     */
    @GetMapping("/user")
    public ResponseEntity<List<RecipeDTO>> getUserRecipes(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<RecipeDTO> recipes =  recipeService.getRecipesByUser(user);
        return ResponseEntity.ok(recipes);
    }

    /**
     * gets recipes created by user id
     * @return HTTP 200 (OK) with a list of users recipes as DTOs
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<List<RecipeDTO>> getUserRecipes(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        List<RecipeDTO> recipes =  recipeService.getRecipesByUser(user);
        return ResponseEntity.ok(recipes);
    }

    /**
     * adds a favourite recipe to authenticated user
     * @param id recipe id
     * @param authentication authenticated user
     * @return whether recipe was added to favourites successfully
     */
    @PostMapping("/{id}/favourite")
    public ResponseEntity<?> addToFavourites(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        recipeService.addToFavourites(user, id);
        return ResponseEntity.ok().build();
    }

    /**
     * removes a recipe from authenticated users favourites
     * @param id recipe id
     * @param authentication authenticated user
     * @return whether recipe was removed from favourites successfully
     */
    @DeleteMapping("/{id}/favourite")
    public ResponseEntity<?> removeFromFavourites(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        recipeService.removeFromFavourites(user, id);
        return ResponseEntity.ok().build();
    }


    /**
     * gets User from authenticated user
     * @param authentication authenticated user
     * @return user
     * @throws ApiException user not authenticated or not found
     */
    private User getAuthenticatedUser(Authentication authentication) throws ApiException{
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser authenticatedUser)) {
            throw new ApiException("User not authenticated", HttpStatus.UNAUTHORIZED);
        }

        return userRepository.findByUsername(authenticatedUser.getUsername())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED));
    }

    /**
     * Searches recipes by provided user, title, and tags
     * @param authentication authenticated user
     * @param username username - createdBy
     * @param tags tags
     * @param title recipe title
     * @return HTTP 200 (OK) with a list of matching recipe DTOs, or 204 (No Content) if none found
     */
    @GetMapping("/search")
    public ResponseEntity<List<RecipeDTO>> searchRecipes(
            Authentication authentication,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String title
    ) {
        User user = getAuthenticatedUser(authentication);
        if (tags != null && tags.isEmpty()) {
            tags = null;
        }

        List<RecipeDTO> results = recipeService.search(user, username, title, tags);

        if (results.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(results);
    }

    /**
     * Gets a recipe by id
     * @param id recipe id
     * @return HTTP 200 (OK) with the recipe DTO if found, or 404 (Not Found) if not found or not accessible
     */
    @GetMapping("/recipe/{id}")
    public ResponseEntity<RecipeDTO> getUsersRecipeById(@PathVariable Long id, Authentication authentication) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        RecipeDTO recipe = recipeService.getRecipeDTOById(id,user.getId());
        return ResponseEntity.ok(recipe);
    }

    /**
     * Deletes a recipe by id
     * @param id recipe to delete id
     * @param authentication authenticated user
     * @return whether the recipe was deleted successfully
     */
    @DeleteMapping("/recipe/{id}")
    public ResponseEntity<?> deleteRecipeById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        recipeService.deleteRecipe(user, id);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates an existing recipe
     * @param recipeDTO updated recipe
     * @param authentication authenticated user
     * @return whether the recipe was updated successfully
     */
    @PutMapping
    public ResponseEntity<?> updateRecipe(@RequestBody RecipeDTO recipeDTO, Authentication authentication) {
        String username = getAuthenticatedUser(authentication).getUsername();
        recipeService.updateRecipe(recipeDTO, username);
        return ResponseEntity.ok().build();
    }
}
