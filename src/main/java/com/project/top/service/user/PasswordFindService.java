package com.project.top.service.user;

import com.project.top.dto.user.EmailAndLoginIdCheckDto;
import com.project.top.dto.user.EmailAndLoginIdVerificationDto;

public interface PasswordFindService {
    void checkLoginIdAndSendCode(EmailAndLoginIdCheckDto dto);
    boolean verifyCodeAndLoginId(EmailAndLoginIdVerificationDto dto);
}
