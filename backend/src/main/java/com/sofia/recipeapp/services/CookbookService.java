package com.sofia.recipeapp.services;

import com.sofia.recipeapp.dto.CookbookDTO;
import com.sofia.recipeapp.dto.CreateCookbookDTO;
import com.sofia.recipeapp.exception.ApiException;
import com.sofia.recipeapp.model.Cookbook;
import com.sofia.recipeapp.model.Recipe;
import com.sofia.recipeapp.model.User;
import com.sofia.recipeapp.repository.CookbookRepository;
import com.sofia.recipeapp.repository.RecipeRepository;
import com.sofia.recipeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CookbookService {

    private final CookbookRepository cookbookRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public CookbookDTO createCookbook(CreateCookbookDTO dto, Long ownerId){
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ApiException("Owner not found", HttpStatus.NOT_FOUND));

        Cookbook cookbook = new Cookbook();
        cookbook.setTitle(dto.getTitle());
        cookbook.setDescription(dto.getDescription());
        cookbook.setOwner(owner);
        cookbook.setCollaborators(new HashSet<>());
        cookbook.setRecipes(new HashSet<>());

        Cookbook saved = cookbookRepository.save(cookbook);

        return CookbookDTO.fromEntity(saved);
    }

    public CookbookDTO updateCookbook(Long cookbookId, CreateCookbookDTO dto, Long userId){
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
                .orElseThrow(() -> new ApiException("Cookbook not found", HttpStatus.NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        boolean isAuthorized = cookbook.getOwner().getId().equals(userId) ||
                cookbook.getCollaborators().stream().anyMatch(u -> u.getId().equals(userId));

        if (!isAuthorized) {
            throw new ApiException("Unauthorized", HttpStatus.FORBIDDEN);
        }

        cookbook.setTitle(dto.getTitle());
        cookbook.setDescription(dto.getDescription());

        Cookbook updated = cookbookRepository.save(cookbook);

        return CookbookDTO.fromEntity(updated);
    }

    public void deleteCookbook(Long cookbookId, Long userId) {
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
                .orElseThrow(() -> new ApiException("Cookbook not found", HttpStatus.NOT_FOUND));

        if (!cookbook.getOwner().getId().equals(userId)) {
            throw new ApiException("Only owner can delete cookbook", HttpStatus.FORBIDDEN);
        }

        cookbookRepository.delete(cookbook);
    }


    public CookbookDTO getCookbook(Long cookbookId){
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
                .orElseThrow(() -> new ApiException("Cookbook not found", HttpStatus.NOT_FOUND));

        return CookbookDTO.fromEntity(cookbook);
    }

    public List<CookbookDTO> getAllCookbooks(){
        return cookbookRepository.findAll().stream()
                .map(CookbookDTO::fromEntity)
                .toList();
    }

    public void addRecipe(Long cookbookId, Long recipeId, Long userId){
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
                .orElseThrow(() -> new ApiException("Cookbook not found", HttpStatus.NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ApiException("Recipe not found", HttpStatus.NOT_FOUND));

        if (!cookbook.getOwner().getId().equals(userId) &&
                cookbook.getCollaborators().stream().noneMatch(u -> u.getId().equals(userId))) {
            throw new ApiException("User is not allowed to edit this cookbook", HttpStatus.FORBIDDEN);
        }

        cookbook.getRecipes().add(recipe);
        cookbookRepository.save(cookbook);
    }

    public void removeRecipe(Long cookbookId, Long recipeId, Long userId){
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
                .orElseThrow(() -> new ApiException("Cookbook not found", HttpStatus.NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (!cookbook.getOwner().getId().equals(userId) &&
                cookbook.getCollaborators().stream().noneMatch(u -> u.getId().equals(userId))) {
            throw new ApiException("User is not allowed to edit this cookbook", HttpStatus.FORBIDDEN);
        }

        Recipe recipe = cookbook.getRecipes().stream()
                .filter(r -> r.getId().equals(recipeId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Recipe not in cookbook", HttpStatus.NOT_FOUND));

        cookbook.getRecipes().remove(recipe);
        cookbookRepository.save(cookbook);
    }

    public void addCollaborator(Long cookbookId, String username, Long ownerId) {
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
                .orElseThrow(() -> new ApiException("Cookbook not found", HttpStatus.NOT_FOUND));

        if (!cookbook.getOwner().getId().equals(ownerId)) {
            throw new ApiException("Only the owner can add collaborators", HttpStatus.FORBIDDEN);
        }

        User userToAdd = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (!cookbook.getCollaborators().contains(userToAdd)) {
            cookbook.getCollaborators().add(userToAdd);
            cookbookRepository.save(cookbook);
        }
    }

    public void removeCollaborator(Long cookbookId, String username, Long ownerId) {
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
                .orElseThrow(() -> new ApiException("Cookbook not found", HttpStatus.NOT_FOUND));

        if (!cookbook.getOwner().getId().equals(ownerId)) {
            throw new ApiException("Only the owner can remove collaborators", HttpStatus.FORBIDDEN);
        }

        User collaborator = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (cookbook.getCollaborators().contains(collaborator)) {
            cookbook.getCollaborators().remove(collaborator);
            cookbookRepository.save(cookbook);
        }
    }

    public List<CookbookDTO> getCookbooksForUser(Long id) {
        return cookbookRepository.findAllByOwnerIdOrCollaborators_Id(id, id)
                .stream()
                .map(CookbookDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CookbookDTO> getCookbooksByUser(Long userId) {
        List<Cookbook> cookbooks = cookbookRepository.findAllByOwnerIdOrCollaborators_Id(userId, userId);
        return cookbooks.stream()
                .map(CookbookDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CookbookDTO> searchCookbooks(String title, String username) {

        String titleFilter = (title == null || title.isBlank()) ? null : title.trim();
        String usernameFilter = (username == null || username.isBlank()) ? null : username.trim();

        List<Cookbook> list = cookbookRepository.searchCookbooks(titleFilter, usernameFilter);

        return list.stream()
                .map(CookbookDTO::fromEntity)
                .toList();
    }

}
