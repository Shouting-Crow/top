package com.project.top.dto.application;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ApplicationListResponseDto {
    private String title;
    private List<ApplicationListDto> applicants;

    public ApplicationListResponseDto(String title, List<ApplicationListDto> applicants) {
        this.title = title;
        this.applicants = applicants;
    }
}
