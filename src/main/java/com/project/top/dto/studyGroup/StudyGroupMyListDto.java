package com.project.top.dto.studyGroup;

import com.project.top.domain.StudyGroup;
import lombok.Data;

@Data
public class StudyGroupMyListDto {
    private Long id;
    private String title;
    private int currentMembers;
    private int totalMembers;
    private String topic;
    private int applicantCount;

    public static StudyGroupMyListDto studyGroupMyListFromEntity(StudyGroup studyGroup, int applicantCount) {
        StudyGroupMyListDto studyGroupMyListDto = new StudyGroupMyListDto();
        studyGroupMyListDto.setId(studyGroup.getId());
        studyGroupMyListDto.setTitle(studyGroup.getTitle());
        studyGroupMyListDto.setCurrentMembers(studyGroup.getCurrentMembers());
        studyGroupMyListDto.setTotalMembers(studyGroup.getTotalMembers());
        studyGroupMyListDto.setTopic(studyGroup.getTopic());
        studyGroupMyListDto.setApplicantCount(applicantCount);

        return studyGroupMyListDto;
    }
}
