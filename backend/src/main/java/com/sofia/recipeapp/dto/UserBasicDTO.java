package com.sofia.recipeapp.dto;

import com.sofia.recipeapp.model.User;
import lombok.Data;

@Data
public class UserBasicDTO {

    private Long id;
    private String username;

    public static UserBasicDTO fromEntity(User u) {
        UserBasicDTO dto = new UserBasicDTO();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        return dto;
    }

}
