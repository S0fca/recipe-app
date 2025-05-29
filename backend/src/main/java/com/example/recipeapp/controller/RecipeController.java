package com.example.recipeapp.controller;

import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.dto.UserDTO;
import com.example.recipeapp.model.*;
import com.example.recipeapp.repository.RecipeRepository;
import com.example.recipeapp.repository.UserRepository;
import com.example.recipeapp.services.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RecipeService recipeService;

    /**
     * gets all recipes
     * @param authentication authenticated user
     * @return list of recipe DTO
     */
    @GetMapping
    public List<RecipeDTO> getAllRecipes(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        return recipeRepository.findAll().stream()
                .map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user))
                .toList();
    }

    /**
     * Adds a new recipe to DB
     * @param recipeDTO recipe to add
     * @param authentication authenticated user
     * @return whether the recipe was added successfully
     */
    @PostMapping
    public ResponseEntity<?> addRecipe(@RequestBody RecipeDTO recipeDTO, Authentication authentication) {
        try {
            User user = getAuthenticatedUser(authentication);
            recipeService.addRecipe(recipeDTO, user);
            return ResponseEntity.ok("Recipe created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating recipe: " + e.getMessage());
        }
    }

    /**
     * gets recipes created by authenticated user
     * @param authentication authenticated user
     * @return list of users recipes DTO
     */
    @GetMapping("/user")
    public List<RecipeDTO> getUserRecipes(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        return recipeRepository.findByCreatedByUsername(user.getUsername()).stream()
                .map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user))
                .toList();
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
     */
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDTO userDTO)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        return userRepository.findByUsername(userDTO.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    /**
     * Searches recipes by provided user, title, and tags
     * @param authentication authenticated user
     * @param username username - createdBy
     * @param tags tags
     * @param title recipe title
     * @return List of matching recipe DTO
     */
    @GetMapping("/search")
    public List<RecipeDTO> searchRecipes(
            Authentication authentication,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String title
    ) {
        User user = getAuthenticatedUser(authentication);
        if (tags != null && tags.isEmpty()) {
            tags = null;
        }
        return recipeService.search(user, username, title, tags);
    }

    /**
     * Gets a recipe by id
     * @param id recipe id
     * @param authentication authenticated user
     * @return recipe DTO by recipe id
     */
    @GetMapping("/recipe/{id}")
    public RecipeDTO getUsersRecipeById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return recipeService.getUsersRecipeById(user, id);
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
        User user = getAuthenticatedUser(authentication);
        recipeService.updateRecipe(recipeDTO, user);
        return ResponseEntity.ok().build();
    }
}
