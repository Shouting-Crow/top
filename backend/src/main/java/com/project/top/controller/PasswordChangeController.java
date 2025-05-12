package com.project.top.controller;

import com.project.top.dto.user.PasswordChangeDto;
import com.project.top.service.user.PasswordChangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/change-password")
@RequiredArgsConstructor
public class PasswordChangeController {

    private final PasswordChangeService passwordChangeService;

    @PostMapping
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDto passwordChangeDto) {
        passwordChangeService.changePassword(passwordChangeDto);

        return ResponseEntity.ok("새로운 비밀번호가 성공적으로 등록 되었습니다.");
    }
}
