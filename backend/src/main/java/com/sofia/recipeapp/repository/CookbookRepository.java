package com.sofia.recipeapp.repository;

import com.sofia.recipeapp.model.Cookbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CookbookRepository extends JpaRepository<Cookbook, Long> {
    List<Cookbook> findAllByOwnerIdOrCollaborators_Id(Long ownerId, Long collaboratorId);
    @Query("""
        SELECT DISTINCT c FROM Cookbook c
        LEFT JOIN c.owner o
        LEFT JOIN c.collaborators col
        WHERE (:title IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%')))
        AND (
            :username IS NULL OR LOWER(o.username) LIKE LOWER(CONCAT('%', :username, '%'))
            OR LOWER(col.username) LIKE LOWER(CONCAT('%', :username, '%'))
        )
        """)
    List<Cookbook> searchCookbooks(
            @Param("title") String title,
            @Param("username") String username
    );
}