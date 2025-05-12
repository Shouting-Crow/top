package com.project.top.service.groupMember;

import com.project.top.domain.Group;
import com.project.top.dto.groupMember.GroupMemberDto;
import com.project.top.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupMemberServiceImpl implements GroupMemberService {

    private final GroupRepository groupRepository;

    @Override
    public List<GroupMemberDto> getGroupMembers(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹이 존재하지 않습니다."));

        return group.getMembers().stream()
                .map(GroupMemberDto::groupMemberDtoFromEntity)
                .collect(Collectors.toList());
    }
}
