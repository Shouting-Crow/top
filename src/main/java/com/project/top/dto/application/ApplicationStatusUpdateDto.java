package com.project.top.dto.application;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationStatusUpdateDto {
    private Long applicationId;
    private Long recruitmentId;
    private String status;
}
