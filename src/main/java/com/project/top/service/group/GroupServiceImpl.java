package com.project.top.service.group;

import com.project.top.domain.*;
import com.project.top.dto.group.GroupCreateDto;
import com.project.top.dto.group.GroupDto;
import com.project.top.dto.group.GroupListDto;
import com.project.top.dto.group.GroupUpdateDto;
import com.project.top.repository.*;
import com.project.top.service.chat.ChatService;
import com.project.top.service.message.MessageService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private final ChatService chatService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;


    @Override
    @Transactional
    public GroupDto createGroup(Long creatorId, GroupCreateDto groupCreateDto) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        BasePost basePost = basePostRepository.findById(groupCreateDto.getBasePostId())
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
        group.setType(GroupType.valueOf(groupCreateDto.getType()));
        group.setBasePost(basePost);
        group.setStatus(GroupStatus.ACTIVE);

        group = groupRepository.save(group);

        GroupMember admin = new GroupMember();
        admin.setMember(creator);
        admin.setRole(GroupRole.ADMIN);
        group.addMember(admin);

        List<Application> approvedApplications = applicationRepository
                .findByBasePostIdAndStatus(basePost.getId(), ApplicationStatus.APPROVED);

        for (Application application : approvedApplications) {
            if (application.getApplicant() == null) {
                throw new IllegalStateException("지원자가 없는 상태입니다.");
            }

            GroupMember member = new GroupMember();
            member.setRole(GroupRole.MEMBER);
            member.setMember(application.getApplicant());
            group.addMember(member);
        }

        for (GroupMember groupMember : group.getMembers()) {
            messageService.sendSystemMessage(groupMember.getMember().getId(),
                    "'" + group.getName() + "' 그룹이 생성되었습니다. 그룹원과 함께 활동하세요.");
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
                .map(member -> GroupListDto.groupListDtoFromEntity(member.getGroup(), userId))
                .toList();
    }

    @Override
    @Transactional
    public void leaveGroup(Long groupId, Long memberId) {
        GroupMember member = groupMemberRepository.findByGroupIdAndMember_Id(groupId, memberId)
                .orElseThrow(() -> new IllegalStateException("해당 그룹에 속해있지 않습니다."));

        if (member.getRole() == GroupRole.ADMIN) {
            throw new IllegalStateException("그룹의 관리자는 탈퇴할 수 없습니다. 그룹 삭제를 이용해주세요.");
        }

        String memberNickname = member.getMember().getNickname();

        groupMemberRepository.removeMemberFromGroup(groupId, memberId);

        BasePost basePost = member.getGroup().getBasePost();
        basePost.decrementCurrentMembers();

        basePostRepository.save(basePost);

        boolean chatRoomExist = chatService.chatRoomExist(groupId);
        if (chatRoomExist) {
            chatService.sendSystemMessageToChatRoom(groupId, memberNickname + "님이 그룹을 탈퇴했습니다.");
        }

        //빈 그룹을 자동 삭제
        if (groupMemberRepository.countByGroupId(groupId) == 0) {
            groupRepository.deleteById(groupId);
            chatService.sendSystemMessageToChatRoom(groupId, "그룹이 삭제되었습니다.");
        }
    }

    @Override
    @Transactional
    public Long inviteMember(Long groupId, String nickname) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹이 존재하지 않습니다."));

        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("해당 닉네임의 사용자가 존재하지 않습니다."));

        boolean isMember = group.getMembers().stream()
                        .anyMatch(member -> member.getMember().equals(user));

        if (isMember) {
            throw new IllegalArgumentException("이미 그룹에 존재하는 사용자입니다.");
        }

        GroupMember member = new GroupMember();
        member.setMember(user);
        member.setGroup(group);
        member.setRole(GroupRole.MEMBER);

        group.getMembers().add(member);
        groupMemberRepository.save(member);

        BasePost basePost = member.getGroup().getBasePost();
        basePost.incrementCurrentMembers();
        basePostRepository.save(basePost);

        boolean chatRoomExist = chatService.chatRoomExist(groupId);
        if (chatRoomExist) {
            chatService.sendSystemMessageToChatRoom(groupId, user.getNickname() + "님이 그룹에 초대되었습니다.");
        }

        messageService.sendSystemMessage(user.getId(), "'" + group.getName() + "' 그룹에 초대되었습니다.");

        return member.getId();
    }

    @Override
    @Transactional
    public void removeMember(Long groupId, Long memberId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹이 존재하지 않습니다."));

        GroupMember member = groupMemberRepository.findByGroupIdAndMember_Id(groupId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹에 존재하지 않는 맴버입니다."));

        group.getMembers().remove(member);
        groupMemberRepository.delete(member);

        BasePost basePost = member.getGroup().getBasePost();
        basePost.decrementCurrentMembers();
        basePostRepository.save(basePost);

        messagingTemplate.convertAndSendToUser(
                member.getMember().getLoginId(),
                "/queue/kick",
                "그룹에서 추방된 사용자이므로 채팅방에 참여를 할 수 없습니다."
        );

        boolean chatRoomExist = chatService.chatRoomExist(groupId);
        if (chatRoomExist) {
            chatService.sendSystemMessageToChatRoom(groupId, member.getMember().getNickname() + "님이 그룹에서 추방되었습니다.");
        }

        messageService.sendSystemMessage(member.getMember().getId(), "'" + group.getName() + "' 그룹에서 추방되었습니다.");

    }
}
