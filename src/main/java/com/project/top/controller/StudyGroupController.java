package com.project.top.controller;

import com.project.top.dto.studyGroup.*;
import com.project.top.service.studyGroup.StudyGroupService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-group")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createStudyGroup(
            @RequestBody StudyGroupCreateDto studyGroupCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());
            StudyGroupDto studyGroupDto = studyGroupService.createStudyGroup(creatorId, studyGroupCreateDto);

            return ResponseEntity.status(HttpStatus.CREATED).body(studyGroupDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{studyGroupId}")
    public ResponseEntity<?> updateStudyGroup(
            @PathVariable(name = "studyGroupId") Long studyGroupId,
            @RequestBody StudyGroupUpdateDto studyGroupUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            StudyGroupDto studyGroupDto = studyGroupService.updateStudyGroup(studyGroupId, userId, studyGroupUpdateDto);

            return ResponseEntity.ok(studyGroupDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{studyGroupId}")
    public ResponseEntity<?> deleteStudyGroup(
            @PathVariable(name = "studyGroupId") Long studyGroupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            studyGroupService.deleteStudyGroup(studyGroupId, userId);

            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<StudyGroupListDto>> getStudyGroupList(Pageable pageable) {
        Page<StudyGroupListDto> studyGroupList = studyGroupService.getStudyGroupList(pageable);

        return ResponseEntity.ok(studyGroupList);
    }

    @GetMapping("/my-list")
    public ResponseEntity<List<StudyGroupMyListDto>> getStudyGroupMyList(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            List<StudyGroupMyListDto> studyGroupMyList = studyGroupService.getStudyGroupMyList(userId);

            return ResponseEntity.ok(studyGroupMyList);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{studyGroupId}")
    public ResponseEntity<StudyGroupDto> getStudyGroup(@PathVariable(name = "studyGroupId") Long studyGroupId) {
        StudyGroupDto studyGroupDto = studyGroupService.getStudyGroup(studyGroupId);

        return ResponseEntity.ok(studyGroupDto);
    }

}
