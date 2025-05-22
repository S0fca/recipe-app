package com.example.recipeapp.controller;

import com.example.recipeapp.config.UserAuthProvider;
import com.example.recipeapp.dto.IngredientDTO;
import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.dto.UserDTO;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.UserRepository;
import com.example.recipeapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final UserAuthProvider userAuthProvider;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/favourites/{name}")
    public List<RecipeDTO> getUsersFavourites(@PathVariable String name) {
        return userRepository.findByUsername(name).stream().map(user -> {
            RecipeDTO recipeDTO = new RecipeDTO();
            user.getFavoriteRecipes().stream().map(recipe -> {
                recipeDTO.setId(recipe.getId());
                recipeDTO.setTitle(recipe.getTitle());
                recipeDTO.setDescription(recipe.getDescription());
                recipeDTO.setInstructions(recipe.getInstructions());
                recipeDTO.setCreatedByUsername(recipe.getCreatedBy().getUsername());
                recipeDTO.setIngredients(
                        recipe.getRecipeIngredients().stream()
                                .map(ri -> {
                                    IngredientDTO ingredient = new IngredientDTO();
                                    //ingredient.setId(ri.getIngredient().getId());
                                    ingredient.setName(ri.getIngredient());
                                    ingredient.setQuantity(ri.getQuantity());
                                    return ingredient;
                                })
                                .collect(Collectors.toList())
                );
                recipeDTO.setTags(recipe.getTags().stream()
                        .map(com.example.recipeapp.model.Tag::getName)
                        .collect(Collectors.toList())
                );
                return recipeDTO;
            }).collect(Collectors.toList());

            return recipeDTO;
        }).collect(Collectors.toList());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username is already taken");
        }

        // Uložení s heslem zakódovaným BCryptem
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser.isPresent() && passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            String token = userAuthProvider.createToken(foundUser.get().getUsername());
            UserDTO userDTO = new UserDTO(foundUser.get().getId(), foundUser.get().getUsername(), token);
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }



}
