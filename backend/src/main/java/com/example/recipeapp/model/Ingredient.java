package com.example.recipeapp.model;

import jakarta.persistence.*;

//@Entity
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;



    public Ingredient(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Ingredient() {

    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}
