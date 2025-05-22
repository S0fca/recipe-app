package com.example.recipeapp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("Authorization header: " + header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Authentication auth = userAuthProvider.validateToken(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("Authentication set for user: " + auth.getName());
            } catch (Exception e) {
                System.out.println("Invalid token: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            System.out.println("No Bearer token found in request header");
        }
        filterChain.doFilter(request, response);
    }
}
