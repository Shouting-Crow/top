package com.project.top.service.application;

import com.project.top.domain.*;
import com.project.top.dto.application.ApplicationCreateDto;
import com.project.top.dto.application.ApplicationListDto;
import com.project.top.dto.application.ApplicationMyListDto;
import com.project.top.dto.application.ApplicationStatusUpdateDto;
import com.project.top.repository.ApplicationRepository;
import com.project.top.repository.BasePostRepository;
import com.project.top.repository.UserRepository;
import com.project.top.service.message.MessageService;
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
    private final BasePostRepository basePostRepository;
    private final MessageService messageService;

    @Override
    @Transactional
    public Application createApplication(Long applicantId, ApplicationCreateDto applicationCreateDto) {
        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        BasePost basePost = basePostRepository.findById(applicationCreateDto.getRecruitmentId())
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        boolean appliedCheck = applicationRepository.existsByApplicantAndBasePost(applicant, basePost);
        if (appliedCheck){
            throw new IllegalArgumentException("이미 이 공고에 지원했습니다.");
        }

        Application application = new Application();
        application.setApplicant(applicant);
        application.setBasePost(basePost);
        application.setStatus(ApplicationStatus.PENDING);
        application.setApplyDateTime(LocalDateTime.now());

        messageService.sendSystemMessage(applicantId,  "▷" + basePost.getTitle() + "◁" + " 공고에 지원하셨습니다." +
                " 승인될 때까지 기다려주세요.");
        messageService.sendSystemMessage(basePost.getCreator().getId(), applicant.getNickname() + "님이 '"
                + basePost.getTitle() + "' 공고에 지원하였습니다. 승인 및 거부를 눌러주세요.");

        return applicationRepository.save(application);
    }

    @Override
    @Transactional
    public void updateApplicationStatus(Long creatorId, ApplicationStatusUpdateDto applicationStatusUpdateDto) {
        Application application = applicationRepository.findById(applicationStatusUpdateDto.getApplicationId())
                .orElseThrow(() -> new IllegalArgumentException("지원 정보를 찾을 수 없습니다."));

        BasePost basePost = application.getBasePost();

        if (!basePost.getCreator().getId().equals(creatorId)){
            throw new SecurityException("지원 승인/거절할 권한이 없습니다.");
        }

        ApplicationStatus newStatus = applicationStatusUpdateDto.getStatus();

        String statusMessage = (newStatus == ApplicationStatus.APPROVED) ? "▷" + basePost.getTitle()
                + "◁ 공고에 승인되었습니다! 그룹과 채팅방이 만들어질 때까지 기다려주세요." : "▷" + basePost.getTitle()
                + "◁ 공고에 거절되었습니다.";

        application.setStatus(newStatus);

        messageService.sendSystemMessage(application.getApplicant().getId(), statusMessage);

        if (newStatus.equals(ApplicationStatus.APPROVED)){
            basePost.incrementCurrentMembers();
            basePostRepository.save(basePost);
        }
    }

    @Override
    public List<ApplicationListDto> getApplicationList(Long userId, Long basePostId) {
        BasePost basePost = basePostRepository.findById(basePostId)
                .orElseThrow(() -> new IllegalArgumentException("모집 공고를 찾을 수 없습니다."));

        if (!basePost.getCreator().getId().equals(userId)){
            throw new SecurityException("지원 리스트를 볼 권한이 없습니다.");
        }

        List<Application> applications = applicationRepository.findByBasePost(basePost);

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
