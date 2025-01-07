package com.project.top.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginDto {
    private String loginId;
    private String password;
    private boolean rememberMe = false;
}
