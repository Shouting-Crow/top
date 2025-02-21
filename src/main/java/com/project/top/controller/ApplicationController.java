package com.project.top.controller;

import com.project.top.domain.Application;
import com.project.top.domain.BasePost;
import com.project.top.dto.application.*;
import com.project.top.service.application.ApplicationService;
import com.project.top.service.basePost.BasePostService;
import com.project.top.service.message.MessageService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserService userService;
    private final BasePostService basePostService;
    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<?> createApplication(
            @RequestBody ApplicationCreateDto applicationCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            BasePost basePost = basePostService.getBasePostById(applicationCreateDto.getRecruitmentId());

            if (basePost.isInactive()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("마감된 공고에는 지원이 불가능합니다.");
            }

            Long applicantId = userService.getUserIdFromLoginId(userDetails.getUsername());
            Application application = applicationService.createApplication(applicantId, applicationCreateDto);

            return ResponseEntity.status(HttpStatus.CREATED).body(ApplicationDto.applicationDtoFromEntity(application));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateApplicationStatus(
            @RequestBody ApplicationStatusUpdateDto applicationStatusUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());
            applicationService.updateApplicationStatus(creatorId, applicationStatusUpdateDto);

            return ResponseEntity.ok("지원 상태가 업데이트 되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{basePostId}/list")
    public ResponseEntity<?> getApplicationList(
            @PathVariable(name = "basePostId") Long basePostId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            List<ApplicationListDto> applicationList = applicationService.getApplicationList(userId, basePostId);

            return ResponseEntity.ok(applicationList);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/my-list")
    public ResponseEntity<?> getApplicationMyList(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            List<ApplicationMyListDto> applicationMyList = applicationService.getApplicationMyList(userId);

            return ResponseEntity.ok(applicationMyList);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable(name = "applicationId") Long applicationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            applicationService.deleteApplication(applicationId);

            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}








