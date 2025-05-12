package com.project.top.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserRegistrationDto {
    @NotBlank(message = "아이디 입력은 필수 입니다.")
    private String loginId;

    @NotBlank(message = "비밀번호 입력은 필수 입니다.")
    private String password;

    @NotBlank(message = "이메일 입력은 필수 입니다.")
    @Email(message = "올바른 이메일 형식을 입력해주세요.")
    private String email;

    @NotBlank(message = "전화번호 입력은 필수 입니다.")
    @Pattern(regexp = "^\\d{10,11}$", message = "전화번호는 -제외하고 입력해주세요.")
    private String phoneNumber;

    @NotBlank(message = "닉네임 입력은 필수 입니다.")
    private String nickname;
}
