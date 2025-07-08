package com.project.top.dto.studyGroup;

import com.project.top.domain.StudyGroup;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StudyGroupListDto {
    private Long id;
    private String creatorNickname;
    private String title;
    private int currentMembers;
    private int totalMembers;
    private String topic;
    private boolean isInactive;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private int views;
    private LocalDate startDate;
    private LocalDate endDate;

    public static StudyGroupListDto studyGroupListDtoFromEntity(StudyGroup studyGroup) {
        StudyGroupListDto studyGroupListDto = new StudyGroupListDto();
        studyGroupListDto.setId(studyGroup.getId());
        studyGroupListDto.setTitle(studyGroup.getTitle());
        studyGroupListDto.setTopic(studyGroup.getTopic());
        studyGroupListDto.setCurrentMembers(studyGroup.getCurrentMembers());
        studyGroupListDto.setTotalMembers(studyGroup.getTotalMembers());
        studyGroupListDto.setCreatorNickname(studyGroup.getCreator().getNickname());
        studyGroupListDto.setDueDate(studyGroup.getDueDate());
        studyGroupListDto.setInactive(studyGroup.isInactive());
        studyGroupListDto.setCreatedAt(studyGroup.getCreatedDateTime());
        studyGroupListDto.setViews(studyGroup.getViews());
        studyGroupListDto.setStartDate(studyGroup.getStartDate());
        studyGroupListDto.setEndDate(studyGroup.getEndDate());

        return studyGroupListDto;
    }
}
