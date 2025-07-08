package com.project.top.dto.userInfo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class UserInfoUpdateDto {
    @NotBlank(message = "연락처를 입력해주세요.")
    private String contact;

    @NotEmpty(message = "최소 하나 이상의 기술 스택을 입력해야 합니다.")
    private List<String> techStacks;

    @NotBlank(message = "지원 분야를 입력해주세요.")
    @Size(max = 50, message = "지원 분야는 최대 50자까지 입력 가능합니다.")
    private String field;
}
