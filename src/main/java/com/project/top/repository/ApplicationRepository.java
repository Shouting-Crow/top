package com.project.top.repository;

import com.project.top.domain.Application;
import com.project.top.domain.Recruitment;
import com.project.top.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByApplicantAndRecruitment(User applicant, Recruitment recruitment);
    List<Application> findByRecruitment(Recruitment recruitment);
    List<Application> findByApplicant(User applicant);
}
