package com.project.top.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmailVerificationDto {
    private String email;
    private String code;
}
