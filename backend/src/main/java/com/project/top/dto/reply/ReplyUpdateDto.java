package com.project.top.dto.reply;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReplyUpdateDto {
    @NotBlank(message = "댓글 내용을 입력해야 합니다.")
    @Size(max = 500, message = "댓글은 최대 500자까지 입력할 수 있습니다.")
    private String content;
}
