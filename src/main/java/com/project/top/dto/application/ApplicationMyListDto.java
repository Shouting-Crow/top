package com.project.top.dto.application;

import com.project.top.domain.Application;
import com.project.top.domain.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApplicationMyListDto {
    private Long applicationId;
    private String recruitmentTitle;
    private ApplicationStatus status;
    private LocalDateTime applyDateTime;

    public static ApplicationMyListDto applicationMyListFromEntity(Application application) {
        ApplicationMyListDto dto = new ApplicationMyListDto();

        dto.setApplicationId(application.getId());
        dto.setRecruitmentTitle(application.getBasePost().getTitle());
        dto.setStatus(application.getStatus());
        dto.setApplyDateTime(application.getApplyDateTime());

        return dto;
    }
}
