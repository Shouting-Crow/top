package com.project.top.service.recruitment;

import com.project.top.domain.Recruitment;
import com.project.top.dto.recruitment.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RecruitmentService {
    Recruitment createRecruitment(Long creatorId, RecruitmentCreateDto recruitmentCreateDto);
    Recruitment updateRecruitment(Long recruitmentId, Long userId, RecruitmentUpdateDto recruitmentUpdateDto);
    void deleteRecruitment(Long userId, Long recruitmentId);
    Page<RecruitmentListDto> getRecruitmentList(Pageable pageable);
    Page<RecruitmentListDto> searchRecruitmentList(RecruitmentSearchDto recruitmentSearchDto, Pageable pageable);
    RecruitmentDto getRecruitment(Long recruitmentId);
    List<RecruitmentListDto> getRecruitmentMyList(Long creatorId);
    void closeRecruitment(Long recruitmentId, Long creatorId);
    List<RecruitmentListDto> getPopularRecruitmentList();
}
