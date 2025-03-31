package com.project.top.dto.groupMember;

import com.project.top.domain.GroupMember;
import com.project.top.domain.GroupRole;
import lombok.Data;

@Data
public class GroupMemberDto {
    private Long userId;
    private String nickname;
    private GroupRole role;
    private boolean isNew = false;

    public static GroupMemberDto groupMemberDtoFromEntity(GroupMember groupMember) {
        GroupMemberDto dto = new GroupMemberDto();
        dto.setUserId(groupMember.getMember().getId());
        dto.setNickname(groupMember.getMember().getNickname());
        dto.setRole(groupMember.getRole());

        return dto;
    }
}
