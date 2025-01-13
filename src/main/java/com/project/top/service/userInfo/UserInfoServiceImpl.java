package com.project.top.service.userInfo;

import com.project.top.domain.User;
import com.project.top.domain.UserInfo;
import com.project.top.dto.userInfo.UserInfoCreateDto;
import com.project.top.dto.userInfo.UserInfoPublicViewDto;
import com.project.top.dto.userInfo.UserInfoSelfViewDto;
import com.project.top.dto.userInfo.UserInfoUpdateDto;
import com.project.top.repository.UserInfoRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserInfoServiceImpl implements UserInfoService {

    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;

    @Override
    @Transactional
    public UserInfo createUserInfo(Long userId, UserInfoCreateDto userInfoCreateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UserInfo userInfo = new UserInfo();
        userInfo.setUser(user);
        userInfo.setContact(userInfoCreateDto.getContact());
        userInfo.setTechStacks(userInfoCreateDto.getTechStacks());
        userInfo.setField(userInfoCreateDto.getField());

        return userInfoRepository.save(userInfo);
    }

    @Override
    @Transactional
    public UserInfo updateUserInfo(Long userId, UserInfoUpdateDto userInfoUpdateDto) {
        UserInfo userInfo = userInfoRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        userInfo.setContact(userInfoUpdateDto.getContact());
        userInfo.setTechStacks(userInfoUpdateDto.getTechStacks());
        userInfo.setField(userInfoUpdateDto.getField());

        return userInfo;
    }

    @Override
    public UserInfoSelfViewDto getUserInfoSelfView(Long userId) {
        UserInfo userInfo = userInfoRepository.findByUserIdWithUser(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        return new UserInfoSelfViewDto(userInfo);
    }

    @Override
    public UserInfoPublicViewDto getUserInfoPublicView(Long userId) {
        UserInfo userInfo = userInfoRepository.findByUserIdWithUser(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        return new UserInfoPublicViewDto(userInfo);
    }
}
