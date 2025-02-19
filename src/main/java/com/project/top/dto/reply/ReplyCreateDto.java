package com.project.top.dto.reply;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReplyCreateDto {
    @NotNull(message = "게시글 ID는 필수입니다.")
    private Long boardId;

    @NotNull(message = "작성자 ID는 필수입니다.")
    private Long authorId;

    @NotBlank(message = "댓글 내용을 입력해야 합니다.")
    @Size(max = 500, message = "댓글은 최대 500자까지 입력할 수 있습니다.")
    private String content;

    private Long parentReplyId;
}
