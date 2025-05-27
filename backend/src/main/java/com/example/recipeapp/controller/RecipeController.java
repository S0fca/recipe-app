package com.example.recipeapp.controller;

import com.example.recipeapp.dto.IngredientDTO;
import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.dto.UserDTO;
import com.example.recipeapp.model.*;
import com.example.recipeapp.repository.RecipeRepository;
import com.example.recipeapp.repository.TagRepository;
import com.example.recipeapp.repository.UserRepository;
import com.example.recipeapp.services.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final RecipeService recipeService;

    @GetMapping
    public List<RecipeDTO> getAllRecipes(Authentication authentication) {
        final User user = (authentication != null && authentication.getPrincipal() instanceof UserDTO userDTO)
                ? userRepository.findByUsername(userDTO.getUsername()).orElse(null)
                : null;
        return recipeRepository.findAll().stream()
                .map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> addRecipe(@RequestBody RecipeDTO recipeDTO, Authentication authentication) {
        try {
            UserDTO user = (UserDTO) authentication.getPrincipal();
            User recipeAuthor = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

            Recipe recipe = new Recipe();
            recipe.setTitle(recipeDTO.getTitle());
            recipe.setDescription(recipeDTO.getDescription());
            recipe.setInstructions(recipeDTO.getInstructions());
            recipe.setCreatedBy(recipeAuthor);

            List<RecipeIngredient> recipeIngredients = recipeDTO.getIngredients().stream().map(ingredientDTO -> {
                RecipeIngredient ri = new RecipeIngredient();
                ri.setRecipe(recipe);
                ri.setQuantity(ingredientDTO.getQuantity());
                ri.setIngredientName(ingredientDTO.getIngredient());
                return ri;
            }).toList();

            recipe.setRecipeIngredients(recipeIngredients);

            Set<Tag> tags = tagRepository.findAllByNameIn(recipeDTO.getTags());
            recipe.setTags(tags);

            recipeRepository.save(recipe);

            return ResponseEntity.ok("Recipe created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating recipe: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public List<RecipeDTO> getUserRecipes(Authentication authentication) {
        final User user = (authentication != null && authentication.getPrincipal() instanceof UserDTO userDTO)
                ? userRepository.findByUsername(userDTO.getUsername()).orElse(null)
                : null;

        return recipeRepository.findByCreatedByUsername(user.getUsername()).stream()
                .map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user))
                .toList();
    }

    @PostMapping("/{id}/favourite")
    public ResponseEntity<?> addToFavourites(@PathVariable Long id, Authentication authentication) {
        UserDTO userDTO = (UserDTO) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDTO.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        recipeService.addToFavourites(user, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/favourite")
    public ResponseEntity<?> removeFromFavourites(@PathVariable Long id, Authentication authentication) {
        UserDTO userDTO = (UserDTO) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDTO.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        recipeService.removeFromFavourites(user, id);
        return ResponseEntity.ok().build();
    }

}
