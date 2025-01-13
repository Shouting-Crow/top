package com.project.top.dto.user;

import lombok.Data;

@Data
public class UserRegistrationDto {
    private String loginId;
    private String password;
    private String email;
    private String phoneNumber;
    private String nickname;
}
