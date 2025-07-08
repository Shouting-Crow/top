package com.project.top.controller;

import com.project.top.domain.BasePost;
import com.project.top.dto.basePost.BasePostMyListDto;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.service.basePost.BasePostService;
import com.project.top.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/base-posts")
@RequiredArgsConstructor
public class BasePostController {

    private final BasePostService basePostService;
    private final UserService userService;

    @GetMapping("/my-posts")
    public ResponseEntity<List<BasePostMyListDto>> getMyPosts(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long creatorId = userService.getUserIdFromLoginId(userDetails.getUsername());

            List<BasePostMyListDto> myBasePosts = basePostService.getMyBasePosts(creatorId);

            return ResponseEntity.ok(myBasePosts);
        } catch (SecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/{basePostId}/view")
    public ResponseEntity<?> increaseView(@PathVariable Long basePostId) {
        basePostService.increaseView(basePostId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{basePostId}")
    public ResponseEntity<?> deleteBasePost(
            @PathVariable Long basePostId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            basePostService.deleteBasePost(basePostId, userId);
            return ResponseEntity.ok().build();
        } catch (SecurityException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("공고 삭제 권한이 없습니다.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("공고를 찾을 수 없습니다.");
        }
    }

}
