package com.project.top.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class UserInfoUpdateDto {
    private String contact;
    private List<String> techStacks;
    private String field;
}
