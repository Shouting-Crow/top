package com.project.top.repository;

import com.project.top.domain.Recruitment;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.dto.recruitment.RecruitmentSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecruitmentRepository extends JpaRepository<Recruitment, Long>, RecruitmentRepositoryCustom {

    @Query(value = "select * from base_post where type = 'RECRUITMENT' order by created_date_time desc",
            countQuery = "select count(*) from base_post where type = 'RECRUITMENT'",
            nativeQuery = true)
    Page<Recruitment> findAllRecruitments(Pageable pageable);

    List<Recruitment> findByCreatorId(Long creatorId);

    List<Recruitment> findTop4ByIsInactiveFalseAndViewsGreaterThanOrderByViewsDescCreatedDateTimeDesc(int minViews);
}
