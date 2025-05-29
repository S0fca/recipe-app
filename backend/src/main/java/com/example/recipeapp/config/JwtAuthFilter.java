package com.example.recipeapp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserAuthProvider userAuthProvider;

    /**
     * A filter that checks every HTTP request and looks for a JWT token.
     * If the token is there, it tries to verify it.
     * 1. Get the Authorization header from the request
     * 2. Check if header is present and starts with "Bearer "
     * 3. Extract the token from the header
     * 4. Validate token and get authentication
     * 5. Set authentication into security context
     * 6. If the token isn't valid, clear the security context
     *
     * @param request incoming HTTP request
     * @param response HTTP response
     * @param filterChain chain of filters
     * @throws ServletException servlet error
     * @throws IOException I/O error
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Get the Authorization header from the request
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Check if header is present and starts with "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Authentication auth = userAuthProvider.validateToken(token); // Validate token and get authentication
                SecurityContextHolder.getContext().setAuthentication(auth); // Set authentication into security context
            } catch (Exception e) {
                System.out.println("Invalid token: " + e.getMessage());
                SecurityContextHolder.clearContext(); // Clear authentication info
            }
        } else {
            System.out.println("No Bearer token found in request header");
        }

        // Continue with the next filter in the chain
        filterChain.doFilter(request, response);
    }
}
