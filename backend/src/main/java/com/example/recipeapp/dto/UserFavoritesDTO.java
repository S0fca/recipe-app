package com.example.recipeapp.dto;

import java.util.List;

public class UserFavoritesDTO {

    private String username;
    private List<RecipeDTO> recipe;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<RecipeDTO> getRecipe() {
        return recipe;
    }

    public void setRecipe(List<RecipeDTO> recipe) {
        this.recipe = recipe;
    }
}
