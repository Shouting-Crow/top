package com.project.top.dto.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BoardUpdateDto {
    @NotBlank(message = "게시글 제목을 입력해야 합니다.")
    @Size(max = 100, message = "제목은 최대 100자까지 입력할 수 있습니다.")
    private String title;

    @NotBlank(message = "게시글 내용을 입력해야 합니다.")
    private String content;
}
