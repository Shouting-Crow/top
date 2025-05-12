package com.project.top.repository;

import com.project.top.dto.studyGroup.StudyGroupListDto;
import com.project.top.dto.studyGroup.StudyGroupSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudyGroupRepositoryCustom {
    Page<StudyGroupListDto> searchStudyGroups(StudyGroupSearchDto studyGroupSearchDto, Pageable pageable);
}
