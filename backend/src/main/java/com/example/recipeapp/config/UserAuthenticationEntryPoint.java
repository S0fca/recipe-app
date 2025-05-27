package com.example.recipeapp.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Entry point for handling unauthorized access.
 */
@Component
public class UserAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /**
     * Called when a user tries to access a secured REST endpoint without being authenticated.
     *
     * @param request HTTP request
     * @param response HTTP response
     * @param authException exception thrown due to authentication failure
     * @throws IOException I/O exception
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        Map<String, String> errorBody = Map.of("error", "Unauthorized path");
        OBJECT_MAPPER.writeValue(response.getOutputStream(), errorBody);
    }

}
