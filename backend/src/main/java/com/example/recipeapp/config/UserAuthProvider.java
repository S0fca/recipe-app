package com.example.recipeapp.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.recipeapp.dto.UserDTO;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * handling JWT token operations
 */
@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    @Value("${security.jwt.token.secret-key:secret-value}")
    private String secretKey;

    private final UserRepository userRepository;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    /**
     * Creates a JWT token for the given user username.
     * @param username users username
     * @return JWT token
     */
    public String createToken(String username) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 1000 * 60 * 60); //1000 * 60 * 60 = 1h

        return JWT.create().withIssuer(username)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(Algorithm.HMAC256(secretKey));
    }

    /**
     * Validates a JWT token
     * @param token JWT token to validate
     * @return Authentication object with user information
     * @throws RuntimeException if the user from the token does not exist
     */
    public Authentication validateToken(String token) throws RuntimeException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey))
                .build();
        DecodedJWT decoded = verifier.verify(token);

        User user = userRepository.findByUsername(decoded.getIssuer())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UsernamePasswordAuthenticationToken(
                new UserDTO(user.getId(), user.getUsername(), null),
                null,
                Collections.emptyList()
        );
    }
}
