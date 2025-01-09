package com.project.top.service;

import com.project.top.domain.Board;
import com.project.top.dto.BoardCreateDto;
import com.project.top.dto.BoardUpdateDto;

public interface BoardService {
    Board createBoard(BoardCreateDto boardCreateDto);
    Board updateBoard(Long boardId, Long userId, BoardUpdateDto boardUpdateDto);
    void deleteBoard(Long boardId, Long userId);
}
