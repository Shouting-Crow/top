package com.project.top.dto.board;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BoardSearchDto {
    private String keyword;
    private String searchType;
    private String boardType;
}
