package com.project.top.controller;

import com.project.top.domain.UserInfo;
import com.project.top.dto.userInfo.*;
import com.project.top.service.userInfo.UserInfoService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-info")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserService userService;
    private final UserInfoService userInfoService;

    @PostMapping
    public ResponseEntity<?> createUserInfo(
            @RequestBody UserInfoCreateDto userInfoCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            UserInfo createdUserInfo = userInfoService.createUserInfo(userId, userInfoCreateDto);
            UserInfoDto userInfoDto = UserInfoDto.userInfoDtoFromEntity(createdUserInfo);
            return ResponseEntity.status(HttpStatus.CREATED).body(userInfoDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateUserInfo(
            @RequestBody UserInfoUpdateDto userInfoUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            UserInfo updatedUserInfo = userInfoService.updateUserInfo(userId, userInfoUpdateDto);
            UserInfoDto userInfoDto = UserInfoDto.userInfoDtoFromEntity(updatedUserInfo);
            return ResponseEntity.ok(userInfoDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/my-info")
    public ResponseEntity<?> getUserInfoSelfView(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            UserInfoSelfViewDto userInfoSelfViewDto = userInfoService.getUserInfoSelfView(userId);
            return ResponseEntity.ok(userInfoSelfViewDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfoPublicView(@PathVariable(name = "userId") Long userId) {
        try {
            UserInfoPublicViewDto userInfoPublicViewDto = userInfoService.getUserInfoPublicView(userId);

            return ResponseEntity.ok(userInfoPublicViewDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
