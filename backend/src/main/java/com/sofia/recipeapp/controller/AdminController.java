package com.sofia.recipeapp.controller;

import com.sofia.recipeapp.dto.RecipeAdminDTO;
import com.sofia.recipeapp.dto.UserDTO;
import com.sofia.recipeapp.dto.UserPasswordDTO;
import com.sofia.recipeapp.model.Recipe;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.services.RecipeService;
import com.sofia.recipeapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final RecipeService recipeService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/recipes")
    public ResponseEntity<List<RecipeAdminDTO>> getAllRecipes() {
        List<RecipeAdminDTO> recipes = recipeService.getAllRecipesAsAdmin();
        return ResponseEntity.ok(recipes);
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<?> deleteRecipeById(@PathVariable Long id) {
        recipeService.deleteRecipeAsAdmin(id);
        return ResponseEntity.ok("Recipe deleted successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody UserPasswordDTO user) {
        return ResponseEntity.ok(userService.loginAdmin(user));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateAdminToken(Authentication authentication) {
        System.out.println(authentication.getAuthorities().toString());
        if (authentication != null && authentication.isAuthenticated()) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
            if (isAdmin) {
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(401).body("Unauthorized or invalid token");
    }


}
