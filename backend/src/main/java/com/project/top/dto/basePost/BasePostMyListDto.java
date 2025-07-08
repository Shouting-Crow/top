package com.project.top.dto.basePost;

import com.project.top.domain.BasePost;
import com.project.top.domain.Recruitment;
import com.project.top.domain.StudyGroup;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
public class BasePostMyListDto {

    private Long basePostId;
    private String title;
    private boolean isInactive;
    private String postType;
    private LocalDateTime createdAt;
    private LocalDate dueDate;
    private int currentMembers;
    private int totalMembers;
    private String topic;
    private int applicantCount;
    private boolean hasGroup;

    public static BasePostMyListDto basePostMyListFromEntity(BasePost basePost) {
        BasePostMyListDto dto = new BasePostMyListDto();

        dto.setBasePostId(basePost.getId());
        dto.setTitle(basePost.getTitle());
        dto.setInactive(basePost.isInactive());
        dto.setCreatedAt(basePost.getCreatedDateTime());
        dto.setDueDate(basePost.getDueDate());
        dto.setCurrentMembers(basePost.getCurrentMembers());
        dto.setTotalMembers(basePost.getTotalMembers());
        dto.setApplicantCount(basePost.getApplications().size());
        dto.setHasGroup(basePost.isHasGroup());

        if (basePost instanceof Recruitment) {
            dto.setPostType("RECRUITMENT");
            dto.setTopic(basePost.getTopic());
        } else if (basePost instanceof StudyGroup) {
            dto.setPostType("STUDY_GROUP");
            dto.setTopic(basePost.getTopic());
        } else {
            dto.setPostType("UNKNOWN");
            dto.setTopic(null);
        }

        return dto;
    }

}
