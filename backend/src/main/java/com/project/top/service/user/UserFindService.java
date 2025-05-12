package com.project.top.service.user;

import com.project.top.dto.user.EmailVerificationDto;
import com.project.top.dto.user.MaskedLoginIdDto;

import java.util.List;

public interface UserFindService {
    void sendVerificationCode(String email);
    List<MaskedLoginIdDto> verifyCodeForFindingLoginIds(EmailVerificationDto dto);
}
