package com.project.top.service.studyGroup;

import com.project.top.dto.studyGroup.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudyGroupService {
    StudyGroupDto createStudyGroup(Long creatorId, StudyGroupCreateDto studyGroupCreateDto);
    StudyGroupDto updateStudyGroup(Long studyGroupId, Long userId, StudyGroupUpdateDto studyGroupUpdateDto);
    void deleteStudyGroup(Long studyGroupId, Long userId);
    Page<StudyGroupListDto> getStudyGroupList(Pageable pageable);
    StudyGroupDto getStudyGroup(Long studyGroupId);
    Page<StudyGroupMyListDto> getStudyGroupMyList(Long userId, Pageable pageable);
}
