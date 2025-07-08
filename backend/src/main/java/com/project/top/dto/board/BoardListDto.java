package com.project.top.dto.board;

import com.project.top.domain.Board;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardListDto {
    private Long boardId;
    private String title;
    private String authorNickname;
    private LocalDateTime createdAt;
    private int views;
    private int replyCount;

    public static BoardListDto fromEntity(Board board) {
        return new BoardListDto(
                board.getId(),
                board.getTitle(),
                board.getAuthor().getNickname(),
                board.getCreatedAt(),
                board.getViews(),
                board.getReplyCount()
        );
    }
}
