package com.sofia.recipeapp.repository;

import com.sofia.recipeapp.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Set<Tag> findAllByNameIn(List<String> names);

    Collection<Object> findByName(String tagName);
}