package com.project.top.dto.group;

import com.project.top.domain.GroupType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GroupCreateDto {
    @NotNull(message = "모집 공고 ID는 필수 입력 값입니다.")
    private Long basePostId;

    @NotBlank(message = "그룹 이름은 필수 입력 값입니다.")
    @Size(min = 3, max = 50, message = "그룹 이름은 3자 이상, 50자 이하로 입력해주세요.")
    private String name;

    @NotBlank(message = "그룹 설명을 입력해주세요.")
    @Size(max = 255, message = "그룹 설명은 최대 255자까지 입력 가능합니다.")
    private String description;

    @NotNull(message = "그룹 타입을 선택해주세요.")
    private GroupType type;
}
