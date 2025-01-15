package com.project.top.service.application;

import com.project.top.domain.Application;
import com.project.top.dto.application.ApplicationCreateDto;
import com.project.top.dto.application.ApplicationListDto;
import com.project.top.dto.application.ApplicationMyListDto;
import com.project.top.dto.application.ApplicationStatusUpdateDto;

import java.util.List;

public interface ApplicationService {
    public Application createApplication(Long userId, ApplicationCreateDto applicationCreateDto);
    public void updateApplicationStatus(Long creatorId, ApplicationStatusUpdateDto applicationStatusUpdateDto);
    public List<ApplicationListDto> getApplicationList(Long userId, Long basePostId);
    public List<ApplicationMyListDto> getApplicationMyList(Long userId);

    //테스트를 위한 삭제 메서드(추후 삭제)
    public void deleteApplication(Long applicationId);

}
