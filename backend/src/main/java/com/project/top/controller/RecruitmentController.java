package com.project.top.controller;

import com.project.top.domain.Recruitment;
import com.project.top.dto.recruitment.*;
import com.project.top.repository.RecruitmentRepository;
import com.project.top.service.recruitment.RecruitmentService;
import com.project.top.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
    private final RecruitmentRepository recruitmentRepository;

    @PostMapping
    public ResponseEntity<?> createRecruitment(
            @Valid @RequestBody RecruitmentCreateDto recruitmentCreateDto,
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
            @Valid @RequestBody RecruitmentUpdateDto recruitmentUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 공고를 찾을 수 없습니다."));

            if (recruitment.isInactive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("이미 종료된 공고는 수정할 수 없습니다.");
            }

            Recruitment updatedRecruitment = recruitmentService.updateRecruitment(recruitmentId, userId, recruitmentUpdateDto);

            return ResponseEntity.ok(RecruitmentDto.recruitmentFromEntity(updatedRecruitment));
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
    public ResponseEntity<Page<RecruitmentListDto>> getRecruitmentList(
            @PageableDefault(size = 16, page = 0) Pageable pageable) {
        Page<RecruitmentListDto> recruitmentList = recruitmentService.getRecruitmentList(pageable);

        return ResponseEntity.ok(recruitmentList);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRecruitmentList(
            @RequestParam String searchType,
            @RequestParam String keyword,
            @PageableDefault(size = 16, page = 0) Pageable pageable) {
        RecruitmentSearchDto recruitmentSearchDto = new RecruitmentSearchDto();
        recruitmentSearchDto.setSearchType(searchType);
        recruitmentSearchDto.setKeyword(keyword);

        Page<RecruitmentListDto> result = recruitmentService.searchRecruitmentList(recruitmentSearchDto, pageable);

        return ResponseEntity.ok(result);
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
    public ResponseEntity<?> getRecruitment(@PathVariable(name = "recruitmentId") Long recruitmentId) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 공고를 찾을 수 없습니다."));

        if (recruitment.isInactive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("이미 종료된 공고는 조회할 수 없습니다.");
        }

        RecruitmentDto recruitmentDto = recruitmentService.getRecruitment(recruitmentId);

        return ResponseEntity.ok(recruitmentDto);
    }

    @PatchMapping("/{recruitmentId}/close")
    public ResponseEntity<?> closeRecruitment(@PathVariable(name = "recruitmentId") Long recruitmentId,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());

            recruitmentService.closeRecruitment(recruitmentId, creatorId);

            return ResponseEntity.ok("프로젝트 모집 공고가 마감되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/popular")
    public ResponseEntity<?> getPopularRecruitments() {
        try {
            List<RecruitmentListDto> results = recruitmentService.getPopularRecruitmentList();

            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
