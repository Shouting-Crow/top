package com.project.top.repository;

import com.project.top.domain.Recruitment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecruitmentRepository extends JpaRepository<Recruitment, Long> {

    @Query(value = "select * from base_post where type = 'RECRUITMENT'",
            countQuery = "select count(*) from base_post where type = 'RECRUITMENT'",
            nativeQuery = true)
    Page<Recruitment> findAllRecruitments(Pageable pageable);

    List<Recruitment> findByCreatorId(Long creatorId);
}
