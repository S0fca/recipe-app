package com.sofia.recipeapp.repository;

import com.sofia.recipeapp.model.Cookbook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CookbookRepository extends JpaRepository<Cookbook, Long> {
    List<Cookbook> findAllByOwnerIdOrCollaborators_Id(Long ownerId, Long collaboratorId);

}