package com.project.top.dto.studyGroup;

import com.project.top.domain.StudyGroup;
import lombok.Data;

@Data
public class StudyGroupListDto {
    private Long id;
    private String creatorNickname;
    private String title;
    private int currentMembers;
    private int totalMembers;
    private String topic;

    public static StudyGroupListDto studyGroupListDtoFromEntity(StudyGroup studyGroup) {
        StudyGroupListDto studyGroupListDto = new StudyGroupListDto();
        studyGroupListDto.setId(studyGroup.getId());
        studyGroupListDto.setTitle(studyGroup.getTitle());
        studyGroupListDto.setTopic(studyGroup.getTopic());
        studyGroupListDto.setCurrentMembers(studyGroup.getCurrentMembers());
        studyGroupListDto.setTotalMembers(studyGroup.getTotalMembers());
        studyGroupListDto.setCreatorNickname(studyGroup.getCreator().getNickname());

        return studyGroupListDto;
    }
}
