package com.project.top.dto.board;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardCreateDto {
    private String title;
    private String content;
    private Long authorId;
    private Long categoryId;
}
