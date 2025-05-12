package com.project.top.controller;

import com.project.top.domain.BasePost;
import com.project.top.domain.GroupRole;
import com.project.top.dto.group.*;
import com.project.top.service.basePost.BasePostService;
import com.project.top.service.group.GroupService;
import com.project.top.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@Slf4j
public class GroupController {

    private final UserService userService;
    private final GroupService groupService;
    private final BasePostService basePostService;

    @PostMapping
    public ResponseEntity<?> createGroup(
            @Valid @RequestBody GroupCreateDto groupCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());

            BasePost basePost = basePostService.getBasePostById(groupCreateDto.getBasePostId());

            if (!basePost.isInactive()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("마감되지 않은 공고는 그룹을 생성할 수 없습니다.");
            }

            GroupDto groupDto = groupService.createGroup(creatorId, groupCreateDto);

            return ResponseEntity.status(HttpStatus.CREATED).body(groupDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @PutMapping("/{groupId}")
    public ResponseEntity<?> updateGroup(
            @PathVariable(name = "groupId") Long groupId,
            @Valid @RequestBody GroupUpdateDto groupUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            GroupDto groupDto = groupService.updateGroup(groupId, userId, groupUpdateDto);

            return ResponseEntity.ok(groupDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("{groupId}")
    public ResponseEntity<?> deleteGroup(
            @PathVariable(name = "groupId") Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            groupService.deleteGroup(groupId, userId);

            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroupPage(
            @PathVariable(name = "groupId") Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            GroupDto groupDto = groupService.getGroup(groupId, userId);

            return ResponseEntity.ok(groupDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/my-groups")
    public ResponseEntity<?> getMyGroups(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            List<GroupListDto> userGroups = groupService.getUserGroups(userId);

            log.info("그룹 리스트 조회 요청 유저 번호 : {}, 그룹 리스트 개수 : {}", userId, userGroups.size());

            return ResponseEntity.ok(userGroups);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{groupId}/leave")
    public ResponseEntity<?> leaveGroup(
            @PathVariable("groupId") Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            groupService.leaveGroup(groupId, userId);

            return ResponseEntity.ok("그룹을 성공적으로 탈퇴했습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{groupId}/invite")
    public ResponseEntity<?> inviteMember(@PathVariable("groupId") Long groupId,
                                          @RequestBody GroupInviteDto groupInviteDto,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            GroupDto group = groupService.getGroup(groupId, userId);

            boolean isAdmin = group.getMembers().stream()
                    .anyMatch(member -> member.getUserId().equals(userId) &&
                            member.getRole() == GroupRole.ADMIN);

            if (!isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("그룹의 관리자만이 초대할 수 있습니다.");
            }

            Long invitedMemberId = groupService.inviteMember(groupId, groupInviteDto.getNickname());
            log.info("초대된 사용자 번호 : {}", invitedMemberId);

            return ResponseEntity.ok("초대가 완료되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{groupId}/remove/{memberId}")
    public ResponseEntity<?> removeMember(@PathVariable("groupId") Long groupId,
                                          @PathVariable("memberId") Long memberId,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            GroupDto group = groupService.getGroup(groupId, userId);

            boolean isAdmin = group.getMembers().stream()
                    .anyMatch(member -> member.getUserId().equals(userId) &&
                            member.getRole() == GroupRole.ADMIN);

            if (!isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("그룹의 관리자만이 추방할 수 있습니다.");
            }

            groupService.removeMember(groupId, memberId);
            log.info("추방된 맴버 ID : {}", memberId);

            return ResponseEntity.ok("사용자가 그룹에서 추방되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}


