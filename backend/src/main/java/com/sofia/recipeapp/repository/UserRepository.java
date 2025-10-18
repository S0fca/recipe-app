package com.sofia.recipeapp.repository;

import com.sofia.recipeapp.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_favorite_recipes WHERE recipe_id = :recipeId", nativeQuery = true)
    void deleteRecipeFromFavorites(@Param("recipeId") Long recipeId);

}
