package com.project.top.controller;

import com.project.top.dto.group.GroupCreateDto;
import com.project.top.dto.group.GroupDto;
import com.project.top.dto.group.GroupListDto;
import com.project.top.dto.group.GroupUpdateDto;
import com.project.top.service.group.GroupService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final UserService userService;
    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<?> createGroup(
            @RequestBody GroupCreateDto groupCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());
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
            @RequestBody GroupUpdateDto groupUpdateDto,
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

            return ResponseEntity.ok(userGroups);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}


