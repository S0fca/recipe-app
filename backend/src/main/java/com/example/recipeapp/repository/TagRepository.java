package com.example.recipeapp.repository;

import com.example.recipeapp.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Set<Tag> findAllByNameIn(List<String> names);
}