package com.project.top.dto.studyGroup;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudyGroupCreateDto {
    @NotBlank(message = "스터디 제목은 필수 입력 값입니다.")
    @Size(min = 2, max = 50, message = "스터디 제목은 2자 이상, 50자 이하로 입력해야 합니다.")
    private String title;

    @NotBlank(message = "스터디 설명을 입력해주세요.")
    @Size(max = 500, message = "스터디 설명은 최대 500자까지 입력 가능합니다.")
    private String description;

    @Min(value = 2, message = "스터디 인원은 최소 2명 이상이어야 합니다.")
    @Max(value = 100, message = "스터디 인원은 최대 100명까지 가능합니다.")
    private int totalMembers;

    @NotBlank(message = "스터디 주제를 입력해주세요.")
    @Size(max = 50, message = "스터디 주제는 최대 50자까지 입력 가능합니다.")
    private String topic;

    @NotNull(message = "스터디 시작 날짜를 입력해주세요.")
    private LocalDate startDate;

    @NotNull(message = "스터디 종료 날짜를 입력해주세요.")
    @Future(message = "스터디 종료 날짜는 현재 날짜 이후여야 합니다.")
    private LocalDate endDate;

    @NotNull(message = "공고 마감날짜를 선택해주세요.")
    private LocalDate dueDate;
}
