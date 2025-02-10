package com.project.top.controller;

import com.project.top.dto.group.GroupDto;
import com.project.top.dto.groupMember.GroupMemberDto;
import com.project.top.service.group.GroupService;
import com.project.top.service.groupMember.GroupMemberService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/group")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupMemberService groupMemberService;
    private final UserService userService;
    private final GroupService groupService;

    @GetMapping("/{groupId}/members")
    public ResponseEntity<?> getGroupMembers(@PathVariable("groupId") Long groupId,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername()); //로그인 확인

            groupService.getGroup(groupId, userId); //그룹 맴버 확인

            List<GroupMemberDto> groupMembers = groupMemberService.getGroupMembers(groupId);

            return ResponseEntity.ok(groupMembers);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }


    }
}
