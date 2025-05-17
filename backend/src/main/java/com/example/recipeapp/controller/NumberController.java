package com.example.recipeapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class NumberController {

    @GetMapping("/api/number")
    public Map<String, Integer> getNumber() {
        return Map.of("value", 42);
    }
}
