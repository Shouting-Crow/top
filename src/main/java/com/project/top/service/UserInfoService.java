package com.project.top.service;

import com.project.top.domain.UserInfo;
import com.project.top.dto.UserInfoCreateDto;
import com.project.top.dto.UserInfoPublicViewDto;
import com.project.top.dto.UserInfoSelfViewDto;
import com.project.top.dto.UserInfoUpdateDto;

public interface UserInfoService {
    public UserInfo createUserInfo(Long userId, UserInfoCreateDto userInfoCreateDto);
    public UserInfo updateUserInfo(Long userId, UserInfoUpdateDto userInfoUpdateDto);
    public UserInfoSelfViewDto getUserInfoSelfView(Long userId);
    public UserInfoPublicViewDto getUserInfoPublicView(Long userId);
}
