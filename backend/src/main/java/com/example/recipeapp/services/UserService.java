package com.example.recipeapp.services;

import com.example.recipeapp.config.UserAuthProvider;
import com.example.recipeapp.dto.UserDTO;
import com.example.recipeapp.exeptions.AppException;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO login(String username, String rawPassword, UserAuthProvider authProvider) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String token = authProvider.createToken(user.getUsername());
        return new UserDTO(user.getId(), user.getUsername(), token);
    }

    public UserDTO findByLogin(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return new UserDTO(user.getId(), user.getUsername(), null); // token není potřeba tady
    }
}

