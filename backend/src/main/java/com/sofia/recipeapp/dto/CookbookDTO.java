package com.sofia.recipeapp.dto;
import com.sofia.recipeapp.model.Cookbook;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CookbookDTO {

    private Long id;
    private String title;
    private String description;

    private UserBasicDTO owner;
    private List<UserBasicDTO> collaborators;

    private List<RecipeDTO> recipes;

    public static CookbookDTO fromEntity(Cookbook c) {
        CookbookDTO dto = new CookbookDTO();

        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());

        dto.setOwner(UserBasicDTO.fromEntity(c.getOwner()));

        dto.setCollaborators(
                c.getCollaborators().stream()
                        .map(UserBasicDTO::fromEntity)
                        .collect(Collectors.toList())
        );

        dto.setRecipes(
                c.getRecipes().stream()
                        .map(r -> RecipeDTO.GetRecipeDTO(r, r.getCreatedBy()))
                        .toList()
        );

        return dto;
    }
}