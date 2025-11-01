package com.sofia.recipeapp.controller;

import com.sofia.recipeapp.model.Tag;
import com.sofia.recipeapp.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagRepository tagRepository;

    /**
     * Gets all available tags.
     *
     * @return HTTP 200 (OK) with a list of all tags
     */
    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return ResponseEntity.ok(tags);
    }


}
