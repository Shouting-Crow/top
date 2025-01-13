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

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Min(2)
    private int totalMembers;

    @NotNull
    private LocalDate dueDate;

    private List<String> tags;
}
