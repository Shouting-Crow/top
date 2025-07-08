package com.project.top.repository;

import com.project.top.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByApplicantAndBasePost(User applicant, BasePost basePost);
    Page<Application> findByBasePost(BasePost basePost, Pageable pageable);
    List<Application> findByApplicant(User applicant);
    List<Application> findByBasePostIdAndStatus(Long basePostId, ApplicationStatus status);
    boolean existsByApplicantIdAndBasePost_CreatorId(Long applicantId, Long creatorId);
}
