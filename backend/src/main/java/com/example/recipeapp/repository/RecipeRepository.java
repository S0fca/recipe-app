package com.example.recipeapp.repository;

import com.example.recipeapp.model.Recipe;
import com.example.recipeapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCreatedByUsername(String username);
}
