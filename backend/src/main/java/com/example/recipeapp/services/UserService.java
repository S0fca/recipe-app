package com.example.recipeapp.services;

import com.example.recipeapp.config.UserAuthProvider;
import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.dto.UserDTO;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.UserRepository;
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

    public UserDTO register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getId(), savedUser.getUsername(), null);
    }

    public UserDTO login(User user) {
        User foundUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = userAuthProvider.createToken(foundUser.getUsername());
        return new UserDTO(foundUser.getId(), foundUser.getUsername(), token);
    }

    public List<RecipeDTO> getUserFavourites(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return Collections.emptyList();

        return userOpt.get().getFavoriteRecipes().stream().map(recipe -> {
            RecipeDTO dto = RecipeDTO.GetRecipeDTO(recipe, userOpt.get());
            return dto;
        }).collect(Collectors.toList());
    }

    public UserDTO findByLogin(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown user"));
        return new UserDTO(user.getId(), user.getUsername(), null);
    }

}
