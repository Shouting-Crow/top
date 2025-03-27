package com.project.top.dto.application;

import com.project.top.domain.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationStatusUpdateDto {
    private Long applicationId;
    private Long basePostId;
    private String status;
}
