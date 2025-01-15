package com.project.top.repository;

import com.project.top.domain.Recruitment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecruitmentRepository extends JpaRepository<Recruitment, Long> {

    @Query("SELECT r FROM Recruitment r WHERE TYPE(r) = Recruitment")
    Page<Recruitment> findAllRecruitments(Pageable pageable);

    List<Recruitment> findByCreatorId(Long creatorId);
}
