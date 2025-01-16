package com.project.top.dto.group;

import com.project.top.domain.Group;
import com.project.top.domain.GroupStatus;
import com.project.top.domain.GroupType;
import com.project.top.dto.groupMember.GroupMemberDto;
import lombok.Data;

import java.util.List;

@Data
public class GroupDto {
    private Long id;
    private String name;
    private String description;
    private GroupType type;
    private GroupStatus status;
    private List<GroupMemberDto> members;

    public static GroupDto groupDtoFromEntity(Group group) {
        GroupDto dto = new GroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setType(group.getType());
        dto.setStatus(group.getStatus());
        dto.setMembers(
                group.getMembers().stream()
                        .map(GroupMemberDto::groupMemberDtoFromEntity)
                        .toList()
        );

        return dto;
    }
}
