package com.project.top.service.userInfo;

import com.project.top.domain.UserInfo;
import com.project.top.dto.userInfo.UserInfoCreateDto;
import com.project.top.dto.userInfo.UserInfoPublicViewDto;
import com.project.top.dto.userInfo.UserInfoSelfViewDto;
import com.project.top.dto.userInfo.UserInfoUpdateDto;

public interface UserInfoService {
    public UserInfo createUserInfo(Long userId, UserInfoCreateDto userInfoCreateDto);
    public UserInfo updateUserInfo(Long userId, UserInfoUpdateDto userInfoUpdateDto);
    public UserInfoSelfViewDto getUserInfoSelfView(Long userId);
    public UserInfoPublicViewDto getUserInfoPublicView(Long userId);
}
