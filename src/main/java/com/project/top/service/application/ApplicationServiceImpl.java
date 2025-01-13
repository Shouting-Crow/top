package com.project.top.service.application;

import com.project.top.domain.Application;
import com.project.top.domain.Recruitment;
import com.project.top.domain.User;
import com.project.top.dto.application.ApplicationCreateDto;
import com.project.top.dto.application.ApplicationListDto;
import com.project.top.dto.application.ApplicationMyListDto;
import com.project.top.dto.application.ApplicationStatusUpdateDto;
import com.project.top.repository.ApplicationRepository;
import com.project.top.repository.RecruitmentRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final RecruitmentRepository recruitmentRepository;

    @Override
    @Transactional
    public Application createApplication(Long applicantId, ApplicationCreateDto applicationCreateDto) {
        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Recruitment recruitment = recruitmentRepository.findById(applicationCreateDto.getRecruitmentId())
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        boolean appliedCheck = applicationRepository.existsByApplicantAndRecruitment(applicant, recruitment);
        if (appliedCheck){
            throw new IllegalArgumentException("이미 이 공고에 지원했습니다.");
        }

        Application application = new Application();
        application.setApplicant(applicant);
        application.setRecruitment(recruitment);
        application.setStatus("PENDING");
        application.setApplyDateTime(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    @Override
    @Transactional
    public void updateApplicationStatus(Long creatorId, ApplicationStatusUpdateDto applicationStatusUpdateDto) {
        Application application = applicationRepository.findById(applicationStatusUpdateDto.getApplicationId())
                .orElseThrow(() -> new IllegalArgumentException("지원 정보를 찾을 수 없습니다."));

        Recruitment recruitment = application.getRecruitment();

        if (!recruitment.getCreator().getId().equals(creatorId)){
            throw new SecurityException("지원 승인/거절할 권한이 없습니다.");
        }

        String newStatus = applicationStatusUpdateDto.getStatus();

        if (!newStatus.equals("APPROVED") && !newStatus.equals("REJECTED")){
            throw new IllegalArgumentException("유효하지 않은 상태 값 입니다.");
        }

        application.setStatus(newStatus);

        if (newStatus.equals("APPROVED")){
            recruitment.incrementCurrentMembers();
            recruitmentRepository.save(recruitment);
        }
    }

    @Override
    public List<ApplicationListDto> getApplicationList(Long userId, Long recruitmentId) {
        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        if (!recruitment.getCreator().getId().equals(userId)){
            throw new SecurityException("지원 리스트를 볼 권한이 없습니다.");
        }

        List<Application> applications = applicationRepository.findByRecruitment(recruitment);

        return applications.stream()
                .map(ApplicationListDto::applicationListFromEntity)
                .toList();
    }

    @Override
    public List<ApplicationMyListDto> getApplicationMyList(Long userId) {
        User applicant = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<Application> applications = applicationRepository.findByApplicant(applicant);

        return applications.stream()
                .map(ApplicationMyListDto::applicationMyListFromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void deleteApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원 정보를 찾을 수 없습니다."));

        applicationRepository.delete(application);
    }
}
