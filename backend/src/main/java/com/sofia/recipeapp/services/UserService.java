package com.sofia.recipeapp.services;

import com.sofia.recipeapp.dto.UserPasswordDTO;
import com.sofia.recipeapp.security.UserAuthProvider;
import com.sofia.recipeapp.dto.RecipeDTO;
import com.sofia.recipeapp.dto.UserDTO;
import com.sofia.recipeapp.exception.ApiException;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserAuthProvider userAuthProvider;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * registers a user - encodes password, adds to DB
     * ResponseStatusException when username is taken
     * @param userDTO user to register
     * @return registered user DTO
     */
    public UserDTO register(UserPasswordDTO userDTO) {
        String username = userDTO.getUsername();
        String password = userDTO.getPassword();

        if (userRepository.existsByUsername(username)) {
            throw new ApiException("Username is already taken", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getId(), savedUser.getUsername(), null);
    }

    /**
     * logs in a user
     * @param user user to log in
     * @return logged in users DTO (id, name, token)
     */
    public UserDTO login(UserPasswordDTO user) {
        User foundUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String token = userAuthProvider.createToken(foundUser.getUsername(), "USER");
        return new UserDTO(foundUser.getId(), foundUser.getUsername(), token);
    }

    /**
     * gets users favourite recipes
     * @param username users name
     * @return list of users favourite recipes DTO
     */
    public List<RecipeDTO> getUserFavouriteRecipes(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.map(user -> user.getFavoriteRecipes().stream().map(recipe -> RecipeDTO.GetRecipeDTO(recipe, user)).collect(Collectors.toList())).orElse(Collections.emptyList());
    }

    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ApiException("User not found", HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(id);
    }

    public UserDTO loginAdmin(UserPasswordDTO user) {
        User foundUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));
        if (!foundUser.getRole().equals("ADMIN")) {
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String token = userAuthProvider.createToken(foundUser.getUsername(), "ADMIN");
        return new UserDTO(foundUser.getId(), foundUser.getUsername(), token);
    }
}
