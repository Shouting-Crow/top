package com.project.top.dto.group;

import com.project.top.domain.Group;
import com.project.top.domain.GroupRole;
import com.project.top.domain.GroupType;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
public class GroupListDto {
    private Long id;
    private String name;
    private String description;
    private GroupType type;
    private boolean isAdmin;

    public static GroupListDto groupListDtoFromEntity(Group group, Long userId) {
        GroupListDto dto = new GroupListDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setType(group.getType());

        boolean isAdmin = group.getMembers().stream()
                .anyMatch(member ->
                        member.getMember().getId().equals(userId) && member.getRole().equals(GroupRole.ADMIN)
                );

        dto.setAdmin(isAdmin);

        return dto;
    }
}
