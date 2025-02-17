package com.project.top.service.userInfo;

import com.project.top.domain.UserInfo;
import com.project.top.dto.userInfo.UserInfoCreateDto;
import com.project.top.dto.userInfo.UserInfoPublicViewDto;
import com.project.top.dto.userInfo.UserInfoSelfViewDto;
import com.project.top.dto.userInfo.UserInfoUpdateDto;

public interface UserInfoService {
    UserInfo createUserInfo(Long userId, UserInfoCreateDto userInfoCreateDto);
    UserInfo updateUserInfo(Long userId, UserInfoUpdateDto userInfoUpdateDto);
    UserInfoSelfViewDto getUserInfoSelfView(Long userId);
    UserInfoPublicViewDto getUserInfoPublicView(Long userId);
    boolean isApplicationForBasePost(Long creatorId, Long applicantId);

}
