package com.sofia.recipeapp.controller;

import com.sofia.recipeapp.dto.CookbookDTO;
import com.sofia.recipeapp.dto.CreateCookbookDTO;
import com.sofia.recipeapp.dto.RecipeDTO;
import com.sofia.recipeapp.security.AuthenticatedUser;
import com.sofia.recipeapp.services.CookbookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/cookbooks")
@RequiredArgsConstructor
public class CookbookController {

    private final CookbookService cookbookService;

    @PostMapping
    public ResponseEntity<CookbookDTO> create(@RequestBody CreateCookbookDTO dto, Authentication authentication)
    {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(cookbookService.createCookbook(dto, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CookbookDTO> update(
            @PathVariable Long id,
            @RequestBody CreateCookbookDTO dto,
            Authentication authentication
    ) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(cookbookService.updateCookbook(id, dto, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        cookbookService.deleteCookbook(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CookbookDTO> getCookbook(@PathVariable Long id) {
        return ResponseEntity.ok(cookbookService.getCookbook(id));
    }

    @GetMapping
    public ResponseEntity<List<CookbookDTO>> getAll() {
        List<CookbookDTO> cookbooks = new ArrayList<>(cookbookService.getAllCookbooks());
        Collections.shuffle(cookbooks);
        return ResponseEntity.ok(cookbooks);
    }


    @PostMapping("/{cookbookId}/recipes/{recipeId}")
    public ResponseEntity<Void> addRecipe(
            @PathVariable Long cookbookId,
            @PathVariable Long recipeId,
            Authentication authentication
    ) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        cookbookService.addRecipe(cookbookId, recipeId, user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cookbookId}/recipes/{recipeId}")
    public ResponseEntity<Void> removeRecipe(
            @PathVariable Long cookbookId,
            @PathVariable Long recipeId,
            Authentication authentication
    ) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        cookbookService.removeRecipe(cookbookId, recipeId, user.getId());
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/{cookbookId}/collaborators")
    public ResponseEntity<Void> addCollaboratorByUsername(
            @PathVariable Long cookbookId,
            @RequestParam String username,
            Authentication authentication
    ) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        cookbookService.addCollaborator(cookbookId, username, user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cookbookId}/collaborators")
    public ResponseEntity<Void> removeCollaboratorByUsername(
            @PathVariable Long cookbookId,
            @RequestParam String username,
            Authentication authentication
    ) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        cookbookService.removeCollaborator(cookbookId, username, user.getId());
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/user")
    public ResponseEntity<List<CookbookDTO>> getMyCookbooks(Authentication authentication) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        List<CookbookDTO> cookbooks = new ArrayList<>(cookbookService.getCookbooksForUser(user.getId()));

        cookbooks.sort(Comparator.comparing(CookbookDTO::getId).reversed());

        return ResponseEntity.ok(cookbooks);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CookbookDTO>> getCookbooksByUser(@PathVariable Long userId) {
        List<CookbookDTO> cookbooks = cookbookService.getCookbooksByUser(userId);
        return ResponseEntity.ok(cookbooks);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CookbookDTO>> searchCookbooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String username
    ) {
        List<CookbookDTO> result = cookbookService.searchCookbooks(title, username);
        return ResponseEntity.ok(result);
    }

}
