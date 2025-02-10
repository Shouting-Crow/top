package com.project.top.service.groupMember;

import com.project.top.domain.GroupMember;
import com.project.top.dto.groupMember.GroupMemberDto;

import java.util.List;

public interface GroupMemberService {
    List<GroupMemberDto> getGroupMembers(Long groupId);
}
