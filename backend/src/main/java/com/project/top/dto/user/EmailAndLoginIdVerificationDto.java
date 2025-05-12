package com.project.top.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmailAndLoginIdVerificationDto {
    private String email;
    private String loginId;
    private String code;
}
