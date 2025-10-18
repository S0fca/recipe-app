package com.sofia.recipeapp.controller;

import com.sofia.recipeapp.dto.RecipeDTO;
import com.sofia.recipeapp.dto.UserDTO;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * gets users favourite recipes
     * @param authentication authenticated user
     * @return HTTP 200 (OK) with a list of favourite recipes
     */
    @GetMapping("/favourites")
    public ResponseEntity<List<RecipeDTO>> getUserFavouriteRecipes(Authentication authentication) {
        UserDTO user = (UserDTO) authentication.getPrincipal();
        List<RecipeDTO> recipeDTOs = userService.getUserFavouriteRecipes(user.getUsername());
        return ResponseEntity.ok(recipeDTOs);
    }

    /**
     * registers user
     * @param user user to register
     * @return registered user DTO
     */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody User user) {
        UserDTO registeredUser = userService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    /**
     * logs in a user
     * @param user user to log in
     * @return registered user DTO
     */
    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.login(user));
    }

    /**
     * validates a token
     * @param authentication authenticated user
     * @return whether token is valid or not
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(401)
                    .body("Invalid or expired token");
        }
    }
}
