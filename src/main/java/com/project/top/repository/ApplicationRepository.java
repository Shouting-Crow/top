package com.project.top.repository;

import com.project.top.domain.Application;
import com.project.top.domain.BasePost;
import com.project.top.domain.Recruitment;
import com.project.top.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByApplicantAndBasePost(User applicant, BasePost basePost);
    List<Application> findByBasePost(BasePost basePost);
    List<Application> findByApplicant(User applicant);
}
