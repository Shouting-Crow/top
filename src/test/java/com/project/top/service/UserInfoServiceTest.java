package com.project.top.service;

import com.project.top.domain.UserInfo;
import com.project.top.dto.userInfo.UserInfoCreateDto;
import com.project.top.dto.userInfo.UserInfoPublicViewDto;
import com.project.top.dto.userInfo.UserInfoSelfViewDto;
import com.project.top.dto.userInfo.UserInfoUpdateDto;
import com.project.top.service.user.UserService;
import com.project.top.service.userInfo.UserInfoService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
@Rollback(false)
@Slf4j
class UserInfoServiceTest {

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private UserService userService;

    @Test
    void userInfoCreateTest() {
        UserInfoCreateDto userInfoCreateDto = new UserInfoCreateDto();
        userInfoCreateDto.setContact("010-3394-0012");
        userInfoCreateDto.setField("백엔드 개발자");
        userInfoCreateDto.setTechStacks(List.of("JPA", "Spring Boot", "Java"));

        UserInfo userInfo = userInfoService.createUserInfo(1L, userInfoCreateDto);

        Assertions.assertNotNull(userInfo);
        Assertions.assertEquals("백엔드 개발자", userInfo.getField());
        Assertions.assertEquals("010-3394-0012", userInfo.getContact());
        Assertions.assertEquals(3, userInfo.getTechStacks().size());
        Assertions.assertEquals("개발자1", userInfo.getUser().getNickname());

    }

    @Test
    @Transactional
    void userInfoUpdateTest() {
        UserInfoUpdateDto userInfoUpdateDto = new UserInfoUpdateDto();
        userInfoUpdateDto.setContact("010-3394-0012");
        userInfoUpdateDto.setField("프론트엔드 개발자");
        userInfoUpdateDto.setTechStacks(List.of("Typescript", "Javascript", "React", "Node.js"));

        UserInfo userInfo = userInfoService.updateUserInfo(1L, userInfoUpdateDto);

        Assertions.assertNotNull(userInfo);
        Assertions.assertEquals("프론트엔드 개발자", userInfo.getField());
        Assertions.assertEquals("010-3394-0012", userInfo.getContact());
        Assertions.assertEquals(4, userInfo.getTechStacks().size());
        Assertions.assertEquals("개발자1", userInfo.getUser().getNickname());
    }

    @Test
    void getUserInfoSelfViewTest() {
        UserInfoSelfViewDto userInfoSelfView = userInfoService.getUserInfoSelfView(1L);

        Assertions.assertNotNull(userInfoSelfView);
        Assertions.assertEquals("프론트엔드 개발자", userInfoSelfView.getField());
        Assertions.assertEquals("010-3394-0012", userInfoSelfView.getContact());
        Assertions.assertEquals("개발자1", userInfoSelfView.getNickname());
        Assertions.assertEquals("newmember1@gmail.com", userInfoSelfView.getEmail());

    }

    @Test
    @Transactional
    void getUserInfoPublicViewTest() {
        UserInfoPublicViewDto userInfoPublicViewDto = userInfoService.getUserInfoPublicView(1L);

        Assertions.assertNotNull(userInfoPublicViewDto);
        Assertions.assertEquals("프론트엔드 개발자", userInfoPublicViewDto.getField());
        Assertions.assertEquals("개발자1", userInfoPublicViewDto.getNickname());
        for (String s : userInfoPublicViewDto.getTechStacks()) {
            log.info("tech : {}", s);
        }

    }


}