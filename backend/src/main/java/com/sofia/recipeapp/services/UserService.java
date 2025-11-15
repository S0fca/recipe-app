package com.sofia.recipeapp.services;

import com.sofia.recipeapp.dto.*;
import com.sofia.recipeapp.model.Recipe;
import com.sofia.recipeapp.security.UserAuthProvider;
import com.sofia.recipeapp.exception.ApiException;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
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

    @Transactional
    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        userRepository.delete(user);
    }

    public UserDTO loginAdmin(UserPasswordDTO user) {
        User foundUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));
        if (!foundUser.getRole().equals("ADMIN")) {
            throw new ApiException("Not admin", HttpStatus.UNAUTHORIZED);
        }
        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String token = userAuthProvider.createToken(foundUser.getUsername(), "ADMIN");
        return new UserDTO(foundUser.getId(), foundUser.getUsername(), token);
    }

    public void updateProfileImage(String username, MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new ApiException("File is empty", HttpStatus.BAD_REQUEST);
            }

            String contentType = file.getContentType();
            if (contentType == null ||
                    !(contentType.equals("image/jpeg") ||
                            contentType.equals("image/png") ||
                            contentType.equals("image/webp"))) {
                throw new ApiException("Unsupported file type. Allowed: jpg, png, webp", HttpStatus.BAD_REQUEST);
            }

            long maxSize = 2 * 1024 * 1024;
            if (file.getSize() > maxSize) {
                throw new ApiException("File too large. Max size is 2 MB", HttpStatus.PAYLOAD_TOO_LARGE);
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

            byte[] resizedImage = resizeImageIfNeeded(file.getBytes(), contentType);

            user.setProfileImage(resizedImage);
            user.setProfileImageType(contentType);
            userRepository.save(user);

        } catch (IOException e) {
            throw new ApiException("Failed to save profile image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private byte[] resizeImageIfNeeded(byte[] originalBytes, String contentType) {
        try {
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(originalBytes));
            if (originalImage == null) return originalBytes;

            int width = originalImage.getWidth();
            int height = originalImage.getHeight();

            if (width <= 400) {
                return originalBytes;
            }

            int newWidth = 400;
            int newHeight = (newWidth * height) / width;

            Image resultingImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);

            BufferedImage outputImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = outputImage.createGraphics();
            g2d.drawImage(resultingImage, 0, 0, null);
            g2d.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            if (contentType.equals("image/png")) {
                ImageIO.write(outputImage, "png", baos);
            } else {
                ImageIO.write(outputImage, "jpg", baos);
            }

            return baos.toByteArray();

        } catch (Exception e) {
            return originalBytes;
        }
    }


    public byte[] getProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProfileImage() == null) {
            throw new RuntimeException("User has no profile image");
        }

        return user.getProfileImage();
    }

    public UserProfileDTO getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        return new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getBio(),
                "/api/users/" + user.getId() + "/image"
        );
    }

    public UserProfileDTO updateUser(String currentUsername, UserUpdateDTO dto) {

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (dto.getUsername() != null && !dto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new ApiException("Username already taken", HttpStatus.BAD_REQUEST);
            }
            user.setUsername(dto.getUsername());
        }

        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }

        userRepository.save(user);

        return new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getBio(),
                "/api/users/" + user.getId() + "/image"
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}

