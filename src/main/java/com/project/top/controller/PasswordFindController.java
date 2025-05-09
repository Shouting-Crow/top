package com.project.top.controller;

import com.project.top.dto.user.*;
import com.project.top.service.user.PasswordFindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/find-password")
@RequiredArgsConstructor
public class PasswordFindController {

    private final PasswordFindService passwordFindService;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailAndLoginIdCheckDto dto) {
        passwordFindService.checkLoginIdAndSendCode(dto);

        return ResponseEntity.ok("인증 코드가 이메일로 전송되었습니다.");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody EmailAndLoginIdVerificationDto dto) {
        boolean isVerified = passwordFindService.verifyCodeAndLoginId(dto);

        return ResponseEntity.ok(isVerified);
    }
}
