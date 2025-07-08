package com.project.top.service.application;

import com.project.top.domain.Application;
import com.project.top.dto.application.ApplicationCreateDto;
import com.project.top.dto.application.ApplicationListDto;
import com.project.top.dto.application.ApplicationMyListDto;
import com.project.top.dto.application.ApplicationStatusUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ApplicationService {
    Application createApplication(Long userId, ApplicationCreateDto applicationCreateDto);
    void updateApplicationStatus(Long creatorId, ApplicationStatusUpdateDto applicationStatusUpdateDto);
    Page<ApplicationListDto> getApplicationList(Long userId, Long basePostId, Pageable pageable);
    List<ApplicationMyListDto> getApplicationMyList(Long userId);
    String getBasePostTitle(Long basePostId);

    //테스트를 위한 삭제 메서드(추후 삭제)
    void deleteApplication(Long applicationId);

}
