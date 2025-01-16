package com.project.top.repository;

import com.project.top.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByApplicantAndBasePost(User applicant, BasePost basePost);
    List<Application> findByBasePost(BasePost basePost);
    List<Application> findByApplicant(User applicant);
    List<Application> findByBasePostIdAndStatus(Long basePostId, ApplicationStatus status);
}
