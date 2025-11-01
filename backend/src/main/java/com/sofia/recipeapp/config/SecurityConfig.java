package com.sofia.recipeapp.config;

import com.sofia.recipeapp.security.JwtAuthFilter;
import com.sofia.recipeapp.security.UserAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;


import java.util.List;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;

    @Value("${app.allowed-origins}")
    private String allowedOrigins;

    /**
     * Defines security rules and filter chain.
     *
     * @param http Spring Security HTTP config
     * @return security filter chain
     * @throws Exception configuration error
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/users/register", "/api/users/login", "/api/admin/login").permitAll() // Public endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated() // Others require authentication
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(userAuthenticationEntryPoint)) // Unauthenticated user handler
                .addFilterBefore(jwtAuthFilter, BasicAuthenticationFilter.class) // JWT filter first
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults()); // Enable CORS

        return http.build();
    }

    /**
     * Configures CORS to allow requests from frontend
     *
     * @return CORS config source
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Password encoder for encoding and verifying passwords.
     * @return password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

