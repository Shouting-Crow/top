package com.project.top.dto;

import lombok.Data;

@Data
public class ReplyCreateDto {
    private Long boardId;
    private Long authorId;
    private String content;
    private Long parentReplyId;
}
