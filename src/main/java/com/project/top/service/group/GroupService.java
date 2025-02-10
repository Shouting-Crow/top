package com.project.top.service.group;

import com.project.top.dto.group.GroupCreateDto;
import com.project.top.dto.group.GroupDto;
import com.project.top.dto.group.GroupListDto;
import com.project.top.dto.group.GroupUpdateDto;

import java.util.List;

public interface GroupService {
    GroupDto createGroup(Long creatorId, GroupCreateDto groupCreateDto);
    GroupDto updateGroup(Long groupId, Long creatorId, GroupUpdateDto groupUpdateDto);
    void deleteGroup(Long groupId, Long creatorId);
    GroupDto getGroup(Long groupId, Long userId);
    List<GroupListDto> getUserGroups(Long userId);
    void leaveGroup(Long groupId, Long memberId);
    Long inviteMember(Long groupId, String nickname);

}
