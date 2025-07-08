package com.project.top.service.recruitment;

import com.project.top.domain.BasePost;
import com.project.top.domain.Recruitment;
import com.project.top.domain.User;
import com.project.top.dto.recruitment.*;
import com.project.top.repository.BasePostRepository;
import com.project.top.repository.RecruitmentRepository;
import com.project.top.repository.UserRepository;
import com.project.top.service.basePost.BasePostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecruitmentServiceImpl implements RecruitmentService {

    private final BasePostRepository basePostRepository;
    private final UserRepository userRepository;
    private final RecruitmentRepository recruitmentRepository;
    private final BasePostService basePostService;

    @Override
    @Transactional
    public Recruitment createRecruitment(Long creatorId, RecruitmentCreateDto recruitmentCreateDto) {
        User creator = userRepository.findById(creatorId).
                orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Recruitment recruitment = new Recruitment();
        recruitment.setTitle(recruitmentCreateDto.getTitle());
        recruitment.setDescription(recruitmentCreateDto.getDescription());
        recruitment.setTotalMembers(recruitmentCreateDto.getTotalMembers());
        recruitment.setCurrentMembers(1);
        recruitment.setCreatedDateTime(LocalDateTime.now());
        recruitment.setDueDate(recruitmentCreateDto.getDueDate());
        recruitment.setTags(recruitmentCreateDto.getTags());
        recruitment.setCreator(creator);
        recruitment.setTags(recruitmentCreateDto.getTags());
        recruitment.setTopic(recruitmentCreateDto.getTopic());

        return (Recruitment) basePostRepository.save(recruitment);
    }

    @Override
    @Transactional
    public Recruitment updateRecruitment(Long recruitmentId, Long userId, RecruitmentUpdateDto recruitmentUpdateDto) {
        BasePost basePost = basePostRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        if (!basePost.getCreator().getId().equals(userId)) {
            throw new SecurityException("모집 공고를 수정할 권한이 없습니다.");
        }

        Recruitment recruitment = (Recruitment) basePost;

        recruitment.setTitle(recruitmentUpdateDto.getTitle());
        recruitment.setDescription(recruitmentUpdateDto.getDescription());
        recruitment.setTotalMembers(recruitmentUpdateDto.getTotalMembers());
        recruitment.setDueDate(recruitmentUpdateDto.getDueDate());
        recruitment.setTags(recruitmentUpdateDto.getTags());
        recruitment.setTopic(recruitmentUpdateDto.getTopic());

        return recruitment;
    }

    @Override
    @Transactional
    public void deleteRecruitment(Long userId, Long recruitmentId) {
        BasePost basePost = basePostRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        if (!basePost.getCreator().getId().equals(userId)) {
            throw new SecurityException("모집 공고를 삭제할 권한이 없습니다.");
        }

        basePostRepository.delete(basePost);
    }

    @Override
    public Page<RecruitmentListDto> getRecruitmentList(Pageable pageable) {
        Page<Recruitment> recruitments = recruitmentRepository.findAllRecruitments(pageable);

        return recruitments.map(RecruitmentListDto::recruitmentsFromEntity);
    }

    @Override
    public Page<RecruitmentListDto> searchRecruitmentList(RecruitmentSearchDto recruitmentSearchDto, Pageable pageable) {
        return recruitmentRepository.searchRecruitments(recruitmentSearchDto, pageable);
    }

    @Override
    public RecruitmentDto getRecruitment(Long recruitmentId) {
        BasePost basePost = basePostRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 모집 공고를 찾을 수 없습니다."));

        Recruitment recruitment = (Recruitment) basePost;

        return RecruitmentDto.recruitmentFromEntity(recruitment);
    }

    @Override
    public List<RecruitmentListDto> getRecruitmentMyList(Long creatorId) {
        List<Recruitment> recruitments = recruitmentRepository.findByCreatorId(creatorId).stream()
                .filter(recruitment -> !recruitment.getDueDate().isBefore(LocalDate.now()))
                .toList();

        return recruitments.stream()
                .map(RecruitmentListDto::recruitmentsFromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void closeRecruitment(Long recruitmentId, Long creatorId) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 모집 공고를 찾을 수 없습니다."));

        if (!recruitment.getCreator().getId().equals(creatorId)) {
            throw new SecurityException("모집 공고를 마감할 권한이 없습니다.");
        }

        recruitment.setInactive(true);
    }

    @Override
    public List<RecruitmentListDto> getPopularRecruitmentList() {
        List<Recruitment> popularRecruitments = recruitmentRepository
                .findTop4ByIsInactiveFalseAndViewsGreaterThanOrderByViewsDescCreatedDateTimeDesc(0);

        return popularRecruitments.stream()
                .map(RecruitmentListDto::recruitmentsFromEntity)
                .toList();
    }
}
