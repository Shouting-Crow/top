package com.project.top.dto.login;

import lombok.Data;

@Data
public class LoginDto {
    private String loginId;
    private String password;
    private boolean rememberMe = false;
}
