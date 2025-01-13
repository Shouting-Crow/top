package com.project.top.dto.userInfo;

import com.project.top.domain.UserInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class UserInfoSelfViewDto {
    private String nickname;
    private String email;
    private String contact;
    private List<String> techStacks;
    private String field;

    public UserInfoSelfViewDto(UserInfo userInfo) {
        this.nickname = userInfo.getUser().getNickname();
        this.email = userInfo.getUser().getEmail();
        this.contact = userInfo.getContact();
        this.techStacks = userInfo.getTechStacks();
        this.field = userInfo.getField();
    }
}
