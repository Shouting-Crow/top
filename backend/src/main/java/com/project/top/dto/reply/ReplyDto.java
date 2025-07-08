package com.project.top.dto.reply;

import com.project.top.domain.Reply;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ReplyDto {
    private Long id;
    private String content;
    private boolean edited;
    private Long boardId;
    private Long authorId;
    private String authorNickname;
    private Long parentReplyId;
    private LocalDateTime createdAt;

    public static ReplyDto replyDtoFromEntity(Reply reply) {
        ReplyDto dto = new ReplyDto();
        dto.setId(reply.getId());
        dto.setContent(reply.getContent());
        dto.setEdited(reply.isEdited());
        dto.setBoardId(reply.getBoard().getId());
        dto.setAuthorId(reply.getAuthor().getId());
        dto.setAuthorNickname(reply.getAuthor().getNickname());
        dto.setParentReplyId(
                reply.getParentReply() != null ? reply.getParentReply().getId() : null
        );
        dto.setCreatedAt(reply.getCreatedAt());

        return dto;
    }
}
