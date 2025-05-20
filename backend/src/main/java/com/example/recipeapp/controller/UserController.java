package com.example.recipeapp.controller;

import com.example.recipeapp.dto.IngredientDTO;
import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.dto.UserFavoritesDTO;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/favourites/{name}")
    public List<UserFavoritesDTO> getUsersFavourites(@PathVariable String name) {
        return userRepository.findByUsername(name).stream().map(user -> {
            UserFavoritesDTO favouritesDTO = new UserFavoritesDTO();
            favouritesDTO.setUsername(user.getUsername());
            favouritesDTO.setRecipe(
                    user.getFavoriteRecipes().stream().map(recipe -> {
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
                        dto.setTags(recipe.getTags().stream()
                                .map(com.example.recipeapp.model.Tag::getName)
                                .collect(Collectors.toList())
                        );
                        return dto;
                    }).collect(Collectors.toList())
            );
            return favouritesDTO;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username is already taken");
        }
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser.isPresent() && foundUser.get().getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }


}
