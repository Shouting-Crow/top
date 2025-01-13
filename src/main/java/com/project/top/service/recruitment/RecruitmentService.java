package com.project.top.service.recruitment;

import com.project.top.domain.Recruitment;
import com.project.top.dto.recruitment.RecruitmentCreateDto;
import com.project.top.dto.recruitment.RecruitmentDto;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.dto.recruitment.RecruitmentUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecruitmentService {
    Recruitment createRecruitment(Long creatorId, RecruitmentCreateDto recruitmentCreateDto);
    Recruitment updateRecruitment(Long recruitmentId, Long userId, RecruitmentUpdateDto recruitmentUpdateDto);
    void deleteRecruitment(Long userId, Long recruitmentId);
    Page<RecruitmentListDto> getRecruitmentList(Pageable pageable);
    RecruitmentDto getRecruitment(Long recruitmentId);
}
