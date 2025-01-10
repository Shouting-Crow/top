package com.project.top.dto;

import com.project.top.domain.Board;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class BoardDto {
    private Long id;
    private String title;
    private String content;
    private int views;
    private int replyCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AuthorDto author;
    private CategoryDto category;

    public static BoardDto boardDtoFromEntity(Board board) {
        BoardDto dto = new BoardDto();
        dto.setId(board.getId());
        dto.setTitle(board.getTitle());
        dto.setContent(board.getContent());
        dto.setViews(board.getViews());
        dto.setReplyCount(board.getReplyCount());
        dto.setCreatedAt(board.getCreatedAt());
        dto.setUpdatedAt(board.getUpdatedAt());

        AuthorDto authorDto = new AuthorDto();
        authorDto.setId(board.getAuthor().getId());
        authorDto.setLoginId(board.getAuthor().getLoginId());
        authorDto.setNickname(board.getAuthor().getNickname());
        dto.setAuthor(authorDto);

        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(board.getCategory().getId());
        categoryDto.setName(board.getCategory().getName());
        categoryDto.setDescription(board.getCategory().getDescription());
        dto.setCategory(categoryDto);

        return dto;
    }
}
