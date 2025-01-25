package com.project.top.service.application;

import com.project.top.domain.Application;
import com.project.top.domain.ApplicationStatus;
import com.project.top.dto.application.ApplicationCreateDto;
import com.project.top.dto.application.ApplicationListDto;
import com.project.top.dto.application.ApplicationStatusUpdateDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Rollback(false)
@Transactional
@Slf4j
class ApplicationServiceTest {

    @Autowired
    private ApplicationService applicationService;

    @Test
    void createApplication() {
        ApplicationCreateDto dto = new ApplicationCreateDto();
        dto.setRecruitmentId(2L);

        Application application = applicationService.createApplication(1L, dto);

        Assertions.assertNotNull(application);
//        Assertions.assertEquals("PENDING", application.getStatus());
//        Assertions.assertEquals("개발자1", application.getBasePost().getCreator().getNickname());

        log.info("recruitment info : {}", application.getBasePost().getCreator().getNickname());
        log.info("application info : {}", application.getApplyDateTime());
        log.info("application info : {}", application.getApplicant().getNickname());

    }

    @Test
    void createApplicationToStudyGroup() {
        ApplicationCreateDto dto = new ApplicationCreateDto();
        dto.setRecruitmentId(4L);

        Application application = applicationService.createApplication(1L, dto);

        log.info("nickname : {}", application.getApplicant().getNickname());
        log.info("id : {}", application.getId());
        log.info("status : {}", application.getStatus());
        log.info("dateTime : {}", application.getApplyDateTime());
        log.info("title : {}", application.getBasePost().getTitle());
        log.info("description : {}", application.getBasePost().getDescription());
    }

    @Test
    void updateStatusTest() {
        ApplicationStatusUpdateDto dto = new ApplicationStatusUpdateDto();

        dto.setRecruitmentId(1L);
        dto.setApplicationId(1L);
        dto.setStatus(ApplicationStatus.APPROVED);

        applicationService.updateApplicationStatus(1L, dto);

        ApplicationListDto application = applicationService.getApplicationList(1L, 1L).get(0);

        log.info("status : {}", application.getStatus());
    }

    @Test
    void updateStatusTest2() {
        ApplicationStatusUpdateDto dto = new ApplicationStatusUpdateDto();

        dto.setRecruitmentId(4L);
        dto.setApplicationId(2L);
        dto.setStatus(ApplicationStatus.REJECTED);

        applicationService.updateApplicationStatus(2L, dto);

        ApplicationListDto application = applicationService.getApplicationList(1L, 4L).get(0);

        log.info("status : {}", application.getStatus());
    }

}