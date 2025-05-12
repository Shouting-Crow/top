package com.project.top.repository;

import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.dto.recruitment.RecruitmentSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecruitmentRepositoryCustom {
    Page<RecruitmentListDto> searchRecruitments(RecruitmentSearchDto recruitmentSearchDto, Pageable pageable);
}
