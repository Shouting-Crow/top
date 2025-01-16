package com.project.top.dto.group;

import com.project.top.domain.Group;
import com.project.top.domain.GroupType;
import lombok.Data;

@Data
public class GroupListDto {
    private Long id;
    private String name;
    private String description;
    private GroupType type;

    public static GroupListDto groupListDtoFromEntity(Group group) {
        GroupListDto dto = new GroupListDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setType(group.getType());

        return dto;
    }
}
