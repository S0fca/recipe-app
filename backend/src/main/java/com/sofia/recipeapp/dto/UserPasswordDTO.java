package com.sofia.recipeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserPasswordDTO {

    private long id;
    private String username;
    private String password;

}
