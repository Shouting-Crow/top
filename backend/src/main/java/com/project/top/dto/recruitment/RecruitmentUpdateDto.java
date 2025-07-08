package com.project.top.dto.recruitment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class RecruitmentUpdateDto {

    @NotBlank(message = "공고 제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "모집할 프로젝트의 내용을 입력해주세요.")
    private String description;

    @NotNull(message = "전체 그룹 맴버의 수는 반드시 넣어주세요.")
    @Min(2)
    private int totalMembers;

    @NotNull(message = "공고 마감날짜를 선택해주세요.")
    private LocalDate dueDate;

    private List<String> tags;

    private String topic;
}
