package com.project.top.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserRegistrationDto {
    private String loginId;
    private String password;
    private String email;
    private String phoneNumber;
    private String nickname;
}
