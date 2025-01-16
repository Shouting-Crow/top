package com.project.top.service.group;

import com.project.top.domain.*;
import com.project.top.dto.group.GroupCreateDto;
import com.project.top.dto.group.GroupDto;
import com.project.top.dto.group.GroupListDto;
import com.project.top.dto.group.GroupUpdateDto;
import com.project.top.repository.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService{

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final BasePostRepository basePostRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ApplicationRepository applicationRepository;

    private final EntityManager em;


    @Override
    @Transactional
    public GroupDto createGroup(Long basePostId, Long creatorId, GroupCreateDto groupCreateDto) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        BasePost basePost = basePostRepository.findById(basePostId)
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        if (!basePost.getCreator().getId().equals(creatorId)) {
            throw new SecurityException("그룹을 생성할 권한이 없습니다.");
        }

        if (basePost.getGroup() != null) {
            throw new IllegalStateException("이미 그룹이 생성된 모집 공고입니다.");
        }

        Group group = new Group();
        group.setName(groupCreateDto.getName());
        group.setDescription(groupCreateDto.getDescription());
        group.setType(groupCreateDto.getType());
        group.setBasePost(basePost);
        group.setStatus(GroupStatus.ACTIVE);

        group = groupRepository.save(group);

        GroupMember admin = new GroupMember();
        admin.setMember(creator);
        admin.setRole(GroupRole.ADMIN);
        group.addMember(admin);

        List<Application> approvedApplications = applicationRepository.findByBasePostIdAndStatus(basePostId, ApplicationStatus.APPROVED);
        for (Application application : approvedApplications) {
            if (application.getApplicant() == null) {
                throw new IllegalStateException("지원자가 없는 상태입니다.");
            }

            GroupMember member = new GroupMember();
            member.setRole(GroupRole.MEMBER);
            member.setMember(application.getApplicant());
            group.addMember(member);
        }

        group = groupRepository.save(group);

        return GroupDto.groupDtoFromEntity(group);
    }

    @Override
    @Transactional
    public GroupDto updateGroup(Long groupId, Long creatorId, GroupUpdateDto groupUpdateDto) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다."));

        if (!group.getBasePost().getCreator().getId().equals(creatorId)) {
            throw new SecurityException("그룹을 수정할 권한이 없습니다.");
        }

        group.setName(groupUpdateDto.getName());
        group.setDescription(groupUpdateDto.getDescription());

        return GroupDto.groupDtoFromEntity(group);
    }

    @Override
    @Transactional
    public void deleteGroup(Long groupId, Long creatorId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹이 존재하지 않습니다."));

        if (!group.getBasePost().getCreator().getId().equals(creatorId)) {
            throw new SecurityException("그룹을 삭제할 권한이 없습니다.");
        }

        group.getBasePost().setGroup(null);

        groupRepository.deleteById(groupId);
    }

    @Override
    public GroupDto getGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다."));

        boolean isMember = group.getMembers().stream()
                .anyMatch(member -> member.getMember().getId().equals(userId));

        if (!isMember) {
            throw new SecurityException("해당 그룹 상세 정보를 보기 위해서는 그룹의 일원이어야 합니다.");
        }

        return GroupDto.groupDtoFromEntity(group);
    }

    @Override
    public List<GroupListDto> getUserGroups(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<GroupMember> groups = groupMemberRepository.findByMember(user);

        return groups.stream()
                .map(member -> GroupListDto.groupListDtoFromEntity(member.getGroup()))
                .toList();
    }
}
