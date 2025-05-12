package com.project.top.dto.application;

import com.project.top.domain.Application;
import com.project.top.domain.ApplicationStatus;
import com.project.top.domain.UserInfo;
import lombok.Data;

import java.util.List;

@Data
public class ApplicationDto {
    private Long applicationId;
    private String applicantNickname;
    private ApplicationStatus status;
    private List<String> techStacks;
    private String field;
    private String contact;

    public static ApplicationDto applicationDtoFromEntity(Application application) {
        UserInfo userInfo = application.getApplicant().getUserInfo();

        ApplicationDto dto = new ApplicationDto();
        dto.setApplicationId(application.getId());
        dto.setApplicantNickname(application.getApplicant().getNickname());
        dto.setStatus(application.getStatus());
        dto.setTechStacks(userInfo.getTechStacks());
        dto.setField(userInfo.getField());
        dto.setContact(userInfo.getContact());

        return dto;
    }
}
