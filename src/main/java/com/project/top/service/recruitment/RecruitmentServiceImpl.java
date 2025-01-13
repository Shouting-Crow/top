package com.project.top.service.recruitment;

import com.project.top.domain.Recruitment;
import com.project.top.domain.User;
import com.project.top.dto.recruitment.RecruitmentCreateDto;
import com.project.top.dto.recruitment.RecruitmentDto;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.dto.recruitment.RecruitmentUpdateDto;
import com.project.top.repository.RecruitmentRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RecruitmentServiceImpl implements RecruitmentService {

    private final RecruitmentRepository recruitmentRepository;
    private final UserRepository userRepository;

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
        recruitment.setDueDateTime(recruitmentCreateDto.getDueDateTime());
        recruitment.setTags(recruitmentCreateDto.getTags());
        recruitment.setCreatedDateTime(LocalDateTime.now());
        recruitment.setCreator(creator);

        return recruitmentRepository.save(recruitment);
    }

    @Override
    @Transactional
    public Recruitment updateRecruitment(Long recruitmentId, Long userId, RecruitmentUpdateDto recruitmentUpdateDto) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        if (!recruitment.getCreator().getId().equals(userId)) {
            throw new SecurityException("모집 공고를 수정할 권한이 없습니다.");
        }

        recruitment.setTitle(recruitmentUpdateDto.getTitle());
        recruitment.setDescription(recruitmentUpdateDto.getDescription());
        recruitment.setTotalMembers(recruitmentUpdateDto.getTotalMembers());
        recruitment.setDueDateTime(recruitmentUpdateDto.getDueDateTime());
        recruitment.setTags(recruitmentUpdateDto.getTags());

        return recruitment;
    }

    @Override
    @Transactional
    public void deleteRecruitment(Long userId, Long recruitmentId) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        if (!recruitment.getCreator().getId().equals(userId)) {
            throw new SecurityException("모집 공고를 삭제할 권한이 없습니다.");
        }

        recruitmentRepository.delete(recruitment);
    }

    @Override
    public Page<RecruitmentListDto> getRecruitmentList(Pageable pageable) {
        Page<Recruitment> recruitments = recruitmentRepository.findAll(pageable);

        return recruitments.map(RecruitmentListDto::recruitmentsFromEntity);
    }

    @Override
    public RecruitmentDto getRecruitment(Long recruitmentId) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 모집 공고를 찾을 수 없습니다."));

        return RecruitmentDto.recruitmentFromEntity(recruitment);
    }
}
