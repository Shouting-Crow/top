package com.project.top.dto.application;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
public class ApplicationListResponseDto {
    private String title;
    private List<ApplicationListDto> applicants;
    private int totalPages;

    public ApplicationListResponseDto(String title, Page<ApplicationListDto> page) {
        this.title = title;
        this.applicants = page.getContent();
        this.totalPages = page.getTotalPages();
    }
}
