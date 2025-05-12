package com.project.top.controller;

import com.project.top.dto.user.EmailCheckDto;
import com.project.top.dto.user.EmailVerificationDto;
import com.project.top.dto.user.MaskedLoginIdDto;
import com.project.top.service.user.UserFindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/find")
public class UserFindController {

    private final UserFindService userFindService;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailCheckDto emailCheckDto) {
        userFindService.sendVerificationCode(emailCheckDto.getEmail());

        return ResponseEntity.ok("인증 코드가 이메일로 전송되었습니다.");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody EmailVerificationDto emailVerificationDto) {
        List<MaskedLoginIdDto> userLoginIds = userFindService.verifyCodeForFindingLoginIds(emailVerificationDto);

        return ResponseEntity.ok(userLoginIds);
    }
}
