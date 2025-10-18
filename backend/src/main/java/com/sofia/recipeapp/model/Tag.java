package com.sofia.recipeapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * Tag - id, name
 * (Gluten free, Vegan,...)
 */
@Entity
@RequiredArgsConstructor
@Data
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    public Tag(String tagName) {
        this.name = tagName;
    }
}
