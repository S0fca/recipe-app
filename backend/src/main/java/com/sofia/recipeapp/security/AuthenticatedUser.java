package com.sofia.recipeapp.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class AuthenticatedUser {

    private Long  id;
    private String username;
    private String role;

}
