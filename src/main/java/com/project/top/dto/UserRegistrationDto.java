package com.project.top.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserRegistrationDto {
    private String loginId;
    private String password;
    private String email;
    private String phoneNumber;
    private String nickname;
}
