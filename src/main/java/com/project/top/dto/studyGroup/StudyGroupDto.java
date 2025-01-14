package com.project.top.dto.studyGroup;

import com.project.top.domain.StudyGroup;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudyGroupDto {
    private Long id;
    private String creatorNickname;
    private String title;
    private String description;
    private int currentMembers;
    private int totalMembers;
    private String topic;
    private LocalDate startDate;
    private LocalDate endDate;

    public static StudyGroupDto studyGroupDtoFromEntity(StudyGroup studyGroup) {
        StudyGroupDto studyGroupDto = new StudyGroupDto();
        studyGroupDto.setId(studyGroup.getId());
        studyGroupDto.setTitle(studyGroup.getTitle());
        studyGroupDto.setDescription(studyGroup.getDescription());
        studyGroupDto.setStartDate(studyGroup.getStartDate());
        studyGroupDto.setEndDate(studyGroup.getEndDate());
        studyGroupDto.setTopic(studyGroup.getTopic());
        studyGroupDto.setCurrentMembers(studyGroup.getCurrentMembers());
        studyGroupDto.setTotalMembers(studyGroup.getTotalMembers());
        studyGroupDto.setCreatorNickname(studyGroup.getCreator().getNickname());

        return studyGroupDto;
    }
}
