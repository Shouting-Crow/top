package com.project.top.controller;

import com.project.top.domain.Recruitment;
import com.project.top.dto.recruitment.RecruitmentCreateDto;
import com.project.top.dto.recruitment.RecruitmentDto;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.dto.recruitment.RecruitmentUpdateDto;
import com.project.top.service.recruitment.RecruitmentService;
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
@RequestMapping("/api/recruitments")
@RequiredArgsConstructor
public class RecruitmentController {

    private final RecruitmentService recruitmentService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createRecruitment(
            @RequestBody RecruitmentCreateDto recruitmentCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());

            Recruitment recruitment = recruitmentService.createRecruitment(creatorId, recruitmentCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(RecruitmentDto.recruitmentFromEntity(recruitment));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{recruitmentId}")
    public ResponseEntity<?> updateRecruitment(
            @PathVariable(name = "recruitmentId") Long recruitmentId,
            @RequestBody RecruitmentUpdateDto recruitmentUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            Recruitment recruitment = recruitmentService.updateRecruitment(recruitmentId, userId, recruitmentUpdateDto);

            return ResponseEntity.ok(RecruitmentDto.recruitmentFromEntity(recruitment));
        } catch (SecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{recruitmentId}")
    public ResponseEntity<Void> deleteRecruitment(
            @PathVariable(name = "recruitmentId") Long recruitmentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            recruitmentService.deleteRecruitment(userId, recruitmentId);

            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<RecruitmentListDto>> getRecruitmentList(Pageable pageable) {
        Page<RecruitmentListDto> recruitmentList = recruitmentService.getRecruitmentList(pageable);

        return ResponseEntity.ok(recruitmentList);
    }

    @GetMapping("/my-list")
    public ResponseEntity<List<RecruitmentListDto>> getRecruitmentMyList(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());
            List<RecruitmentListDto> recruitmentMyList = recruitmentService.getRecruitmentMyList(creatorId);

            return ResponseEntity.ok(recruitmentMyList);
        } catch (SecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{recruitmentId}")
    public ResponseEntity<RecruitmentDto> getRecruitment(@PathVariable(name = "recruitmentId") Long recruitmentId) {
        RecruitmentDto recruitment = recruitmentService.getRecruitment(recruitmentId);

        return ResponseEntity.ok(recruitment);
    }
}
