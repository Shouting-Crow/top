package com.project.top.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String loginId;
    private String password;
    private String email;
    private String phoneNumber;
    private String nickname;
}
