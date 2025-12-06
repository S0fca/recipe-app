package com.sofia.recipeapp.controller;

import com.sofia.recipeapp.dto.*;
import com.sofia.recipeapp.security.AuthenticatedUser;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
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
        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        List<RecipeDTO> recipeDTOs = userService.getUserFavouriteRecipes(authenticatedUser.getUsername());
        return ResponseEntity.ok(recipeDTOs);
    }

    /**
     * registers user
     * @param user user to register
     * @return registered user DTO
     */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserPasswordDTO user) {
        UserDTO registeredUser = userService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    /**
     * logs in a user
     * @param user user to log in
     * @return registered user DTO
     */
    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody UserPasswordDTO user) {
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

    @PostMapping("/profile/image")
    public ResponseEntity<String> updateProfileImage(
            Authentication authentication,
            @RequestParam("image") MultipartFile file) {

        AuthenticatedUser auth = (AuthenticatedUser) authentication.getPrincipal();

        userService.updateProfileImage(auth.getUsername(), file);

        return ResponseEntity.ok("Profile image updated");
    }


    @GetMapping("/{userId}/image")
    public ResponseEntity<byte[]> getUserImage(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        byte[] image = user.getProfileImage();

        if (image == null || image.length == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
                .ok()
                .header("Content-Type", user.getProfileImageType())
                .body(image);
    }




    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long id) {
        UserProfileDTO dto = userService.getUserProfile(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication authentication,
            @RequestBody UserUpdateDTO dto) {

        AuthenticatedUser auth = (AuthenticatedUser) authentication.getPrincipal();

        UserProfileDTO updated = userService.updateUser(auth.getUsername(), dto);

        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile(Authentication authentication) {
        AuthenticatedUser auth = (AuthenticatedUser) authentication.getPrincipal();
        UserProfileDTO dto = userService.getUserProfile(auth.getId());
        return ResponseEntity.ok(dto);
    }

}
