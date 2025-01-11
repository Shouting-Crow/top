package com.project.top.dto;

import com.project.top.domain.UserInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class UserInfoPublicViewDto {
    private String nickname;
    private String field;
    private List<String> techStacks;

    public UserInfoPublicViewDto(UserInfo userInfo) {
        this.nickname = userInfo.getUser().getNickname();
        this.field = userInfo.getField();
        this.techStacks = userInfo.getTechStacks();
    }
}
