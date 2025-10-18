package com.sofia.recipeapp.services;

import com.sofia.recipeapp.config.UserAuthProvider;
import com.sofia.recipeapp.dto.RecipeDTO;
import com.sofia.recipeapp.dto.UserDTO;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
     * @param user user to register
     * @return registered user DTO
     */
    public UserDTO register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getId(), savedUser.getUsername(), null);
    }

    /**
     * logs in a user
     * @param user user to log in
     * @return logged in users DTO (id, name, token)
     */
    public UserDTO login(User user) {
        User foundUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = userAuthProvider.createToken(foundUser.getUsername());
        return new UserDTO(foundUser.getId(), foundUser.getUsername(), token);
    }

    /**
     * gets users favourite recipes
     * @param username users name
     * @return list of users favourite recipes DTO
     */
    public List<RecipeDTO> getUserFavouriteRecipes(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.map(user -> user.getFavoriteRecipes().stream().map(recipe -> {
            RecipeDTO dto = RecipeDTO.GetRecipeDTO(recipe, user);
            return dto;
        }).collect(Collectors.toList())).orElse(Collections.emptyList());

    }

}
