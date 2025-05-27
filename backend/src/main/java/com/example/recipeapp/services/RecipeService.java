package com.example.recipeapp.services;

import com.example.recipeapp.model.Recipe;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.RecipeRepository;
import com.example.recipeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public void addToFavourites(User user, Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found"));

        if (!user.getFavoriteRecipes().contains(recipe)) {
            user.getFavoriteRecipes().add(recipe);
            userRepository.save(user);
        }
    }

    public void removeFromFavourites(User user, Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found"));

        if (user.getFavoriteRecipes().contains(recipe)) {
            user.getFavoriteRecipes().remove(recipe);
            userRepository.save(user);
        }
    }
}

