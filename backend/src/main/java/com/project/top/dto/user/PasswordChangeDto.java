package com.project.top.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PasswordChangeDto {
    private String loginId;
    private String newPassword;
    private String confirmPassword;
}
