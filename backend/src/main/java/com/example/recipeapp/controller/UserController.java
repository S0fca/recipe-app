package com.example.recipeapp.controller;

import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.dto.UserDTO;
import com.example.recipeapp.model.User;
import com.example.recipeapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/favourites")
    public List<RecipeDTO> getUsersFavourites(Authentication authentication) {
        UserDTO user = (UserDTO) authentication.getPrincipal();
        return userService.getUserFavourites(user.getUsername());
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody User user) {
        UserDTO registeredUser = userService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.login(user));
    }

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
