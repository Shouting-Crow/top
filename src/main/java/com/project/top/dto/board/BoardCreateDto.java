package com.project.top.dto.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardCreateDto {
    @NotBlank(message = "게시글 제목을 입력해야 합니다.")
    @Size(max = 100, message = "제목은 최대 100자까지 입력할 수 있습니다.")
    private String title;

    @NotBlank(message = "게시글 내용을 입력해야 합니다.")
    private String content;

    @NotNull(message = "작성자 ID는 필수입니다.")
    private Long authorId;

    @NotNull(message = "카테고리 ID는 필수입니다.")
    private Long categoryId;
}
