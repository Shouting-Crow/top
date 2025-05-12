package com.project.top.dto.login;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginDto {
    @NotEmpty(message = "아이디를 입력해주세요.")
    private String loginId;

    @NotEmpty(message = "비밀번호를 입력해주세요.")
    private String password;

    private boolean rememberMe = false;
}
