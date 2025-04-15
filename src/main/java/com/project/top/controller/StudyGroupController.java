package com.project.top.controller;

import com.project.top.domain.Recruitment;
import com.project.top.domain.StudyGroup;
import com.project.top.dto.studyGroup.*;
import com.project.top.repository.StudyGroupRepository;
import com.project.top.service.studyGroup.StudyGroupService;
import com.project.top.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;
    private final UserService userService;
    private final StudyGroupRepository studyGroupRepository;

    @PostMapping
    public ResponseEntity<?> createStudyGroup(
            @Valid @RequestBody StudyGroupCreateDto studyGroupCreateDto,
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
            @Valid @RequestBody StudyGroupUpdateDto studyGroupUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 스터디 그룹 공고를 찾을 수 없습니다."));

            if (studyGroup.isInactive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("이미 종료된 공고는 수정할 수 없습니다.");
            }

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
    public ResponseEntity<Page<StudyGroupListDto>> getStudyGroupList(
            @PageableDefault(size = 12, page = 0, sort = "createdDateTime", direction = Sort.Direction.DESC) Pageable pageable) {
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
    public ResponseEntity<?> getStudyGroup(@PathVariable(name = "studyGroupId") Long studyGroupId) {
        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디 그룹 공고를 찾을 수 없습니다."));

        if (studyGroup.isInactive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("이미 종료된 공고는 수정할 수 없습니다.");
        }

        StudyGroupDto studyGroupDto = studyGroupService.getStudyGroup(studyGroupId);

        return ResponseEntity.ok(studyGroupDto);
    }

    @PatchMapping("/{studyGroupId}/close")
    public ResponseEntity<?> closeStudyGroup(@PathVariable(name = "studyGroupId") Long studyGroupId,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());

            studyGroupService.closeStudyGroup(studyGroupId, creatorId);

            return ResponseEntity.ok("스터디 그룹 공고가 마감되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
