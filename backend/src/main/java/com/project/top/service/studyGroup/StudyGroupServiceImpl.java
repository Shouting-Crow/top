package com.project.top.service.studyGroup;

import com.project.top.domain.BasePost;
import com.project.top.domain.StudyGroup;
import com.project.top.domain.User;
import com.project.top.dto.studyGroup.*;
import com.project.top.repository.BasePostRepository;
import com.project.top.repository.StudyGroupRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyGroupServiceImpl implements StudyGroupService{

    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;
    private final BasePostRepository basePostRepository;


    @Override
    @Transactional
    public StudyGroupDto createStudyGroup(Long creatorId, StudyGroupCreateDto studyGroupCreateDto) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        StudyGroup studyGroup = new StudyGroup();
        studyGroup.setTitle(studyGroupCreateDto.getTitle());
        studyGroup.setDescription(studyGroupCreateDto.getDescription());
        studyGroup.setCreator(creator);
        studyGroup.setTopic(studyGroupCreateDto.getTopic());
        studyGroup.setStartAndEndDate(studyGroupCreateDto.getStartDate(), studyGroupCreateDto.getEndDate());
        studyGroup.setCreatedDateTime(LocalDateTime.now());
        studyGroup.setDueDate(studyGroupCreateDto.getDueDate());
        studyGroup.setTotalMembers(studyGroupCreateDto.getTotalMembers());

        StudyGroup savedStudyGroup = studyGroupRepository.save(studyGroup);

        return StudyGroupDto.studyGroupDtoFromEntity(savedStudyGroup);
    }

    @Override
    @Transactional
    public StudyGroupDto updateStudyGroup(Long studyGroupId, Long userId, StudyGroupUpdateDto studyGroupUpdateDto) {
        StudyGroup studyGroup = (StudyGroup) basePostRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디 그룹 모집글을 찾을 수 없습니다."));

        if (!studyGroup.getCreator().getId().equals(userId)) {
            throw new SecurityException("모집글을 수정할 권한이 없습니다.");
        }

        studyGroup.setTitle(studyGroupUpdateDto.getTitle());
        studyGroup.setDescription(studyGroupUpdateDto.getDescription());
        studyGroup.setTopic(studyGroupUpdateDto.getTopic());
        studyGroup.setStartAndEndDate(studyGroupUpdateDto.getStartDate(), studyGroupUpdateDto.getEndDate());
        studyGroup.setTotalMembers(studyGroupUpdateDto.getTotalMembers());
        studyGroup.setDueDate(studyGroupUpdateDto.getDueDate());

        return StudyGroupDto.studyGroupDtoFromEntity(studyGroup);
    }

    @Override
    public void deleteStudyGroup(Long studyGroupId, Long userId) {
        StudyGroup studyGroup = (StudyGroup) basePostRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디 그룹 모집글을 찾을 수 없습니다."));

        if (!studyGroup.getCreator().getId().equals(userId)) {
            throw new SecurityException("모집글을 삭제할 권한이 없습니다.");
        }

        basePostRepository.delete(studyGroup);
    }

    @Override
    public Page<StudyGroupListDto> getStudyGroupList(Pageable pageable) {
        return studyGroupRepository.findAll(pageable)
                .map(StudyGroupListDto::studyGroupListDtoFromEntity);
    }

    @Override
    public Page<StudyGroupListDto> searchStudyGroups(StudyGroupSearchDto dto, Pageable pageable) {
        return studyGroupRepository.searchStudyGroups(dto, pageable);
    }

    @Override
    public StudyGroupDto getStudyGroup(Long studyGroupId) {
        StudyGroup studyGroup = (StudyGroup) basePostRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("스터디 그룹을 찾을 수 없습니다."));

        return StudyGroupDto.studyGroupDtoFromEntity(studyGroup);
    }

    @Override
    public List<StudyGroupMyListDto> getStudyGroupMyList(Long userId) {
        return studyGroupRepository.findAllByCreatorId(userId)
                .stream()
                .map(studyGroup -> {
                    int applicationCount = studyGroup.getApplications().size();
                    return StudyGroupMyListDto.studyGroupMyListFromEntity(studyGroup, applicationCount);
                })
                .toList();

    }

    @Override
    @Transactional
    public void closeStudyGroup(Long studyGroupId, Long creatorId) {
        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디 그룹 공고를 찾을 수 없습니다."));

        if (!studyGroup.getCreator().getId().equals(creatorId)) {
            throw new SecurityException("스터디 그룹 공고를 마감할 권한이 없습니다.");
        }

        studyGroup.setInactive(true);
    }
}
