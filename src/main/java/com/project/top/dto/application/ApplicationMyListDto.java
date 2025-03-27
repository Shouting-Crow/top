package com.project.top.dto.application;

import com.project.top.domain.*;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApplicationMyListDto {
    private Long applicationId;
    private Long basePostId;
    private String recruitmentTitle;
    private ApplicationStatus status;
    private LocalDateTime applyDateTime;
    private boolean isInactive;
    private String postType;

    public static ApplicationMyListDto applicationMyListFromEntity(Application application) {
        ApplicationMyListDto dto = new ApplicationMyListDto();

        BasePost basePost = application.getBasePost();

        dto.setApplicationId(application.getId());
        dto.setBasePostId(basePost.getId());
        dto.setRecruitmentTitle(basePost.getTitle());
        dto.setStatus(application.getStatus());
        dto.setApplyDateTime(application.getApplyDateTime());
        dto.setInactive(basePost.isInactive());

        Class<?> classForType = Hibernate.getClass(basePost);

        if (classForType.equals(Recruitment.class)) {
            dto.setPostType("RECRUITMENT");
        } else if (classForType.equals(StudyGroup.class)) {
            dto.setPostType("STUDY_GROUP");
        } else {
            dto.setPostType("UNKNOWN");
        }

        return dto;
    }
}
