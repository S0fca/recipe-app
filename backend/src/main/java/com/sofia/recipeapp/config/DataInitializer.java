package com.sofia.recipeapp.config;

import com.sofia.recipeapp.model.Tag;
import com.sofia.recipeapp.repository.TagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(TagRepository tagRepository) {
        return args -> {

            List<String> defaultTags = List.of("vegan", "vegetarian", "gluten-free", "lactose-free", "dairy-free");
            for (String tagName : defaultTags) {
                if (tagRepository.findByName(tagName).isEmpty()) {
                    tagRepository.save(new Tag(tagName));
                }
            }
            System.out.println("Default tags added.");

        };
    }
}
