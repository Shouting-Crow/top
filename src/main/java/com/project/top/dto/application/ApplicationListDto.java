package com.project.top.dto.application;

import com.project.top.domain.Application;
import com.project.top.domain.ApplicationStatus;
import com.project.top.domain.UserInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ApplicationListDto {
    private Long applicationId;
    private String applicantNickname;
    private ApplicationStatus status;
    private List<String> techStacks;
    private String field;
    private String contact;
    private Long userId;

    public static ApplicationListDto applicationListFromEntity(Application application) {
        UserInfo userInfo = application.getApplicant().getUserInfo();

        ApplicationListDto dto = new ApplicationListDto();
        dto.setApplicationId(application.getId());
        dto.setApplicantNickname(application.getApplicant().getNickname());
        dto.setStatus(application.getStatus());
        dto.setTechStacks(userInfo.getTechStacks());
        dto.setField(userInfo.getField());
        dto.setContact(userInfo.getContact());
        dto.setUserId(userInfo.getUser().getId());

        return dto;
    }
}
