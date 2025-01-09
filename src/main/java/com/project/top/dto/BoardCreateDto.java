package com.project.top.dto;

import lombok.Data;

@Data
public class BoardCreateDto {
    private String title;
    private String content;
    private Long authorId;
    private Long categoryId;
}
