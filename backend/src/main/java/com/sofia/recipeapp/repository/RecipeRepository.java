package com.sofia.recipeapp.repository;

import com.sofia.recipeapp.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCreatedByUsername(String username);

    @Query("SELECT r FROM Recipe r " +
            "LEFT JOIN r.tags t " +
            "WHERE (:username IS NULL OR LOWER(r.createdBy.username) LIKE LOWER(CONCAT('%', :username, '%'))) " +
            "AND (:title IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:tags IS NULL OR t.name IN :tags) " +
            "GROUP BY r " +
            "HAVING (:tags IS NULL OR COUNT(DISTINCT t.name) = :tagCount)")
    List<Recipe> search(
            @Param("username") String username,
            @Param("title") String title,
            @Param("tags") List<String> tags,
            @Param("tagCount") long tagCount
    );

    Optional<Recipe> findByTitle(String title);
}
