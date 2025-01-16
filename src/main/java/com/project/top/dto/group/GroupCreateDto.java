package com.project.top.dto.group;

import com.project.top.domain.GroupType;
import lombok.Data;

@Data
public class GroupCreateDto {
    private String name;
    private String description;
    private GroupType type;
}
