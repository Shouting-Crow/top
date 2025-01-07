package com.project.top.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class LoginDto {
    private String loginId;
    private String password;
    private boolean rememberMe = false;
}
