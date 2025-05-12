package com.project.top.dto.userInfo;

import com.project.top.domain.UserInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class UserInfoDto {
    private Long id;
    private Long userId;
    private String contact;
    private List<String> techStacks;
    private String field;

    public static UserInfoDto userInfoDtoFromEntity(UserInfo userInfo) {
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setId(userInfo.getId());
        userInfoDto.setUserId(userInfo.getUser().getId());
        userInfoDto.setContact(userInfo.getContact());
        userInfoDto.setTechStacks(userInfo.getTechStacks());
        userInfoDto.setField(userInfo.getField());

        return userInfoDto;
    }
}
