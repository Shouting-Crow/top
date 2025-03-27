package com.project.top.controller;

import com.project.top.domain.BasePost;
import com.project.top.dto.basePost.BasePostMyListDto;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.service.basePost.BasePostService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
