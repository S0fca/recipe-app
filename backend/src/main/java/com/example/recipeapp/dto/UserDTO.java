package com.example.recipeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UserDTO - id, username, token
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    private long id;
    private String username;
    private String token;

}
