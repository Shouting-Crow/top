package com.project.top.service.board;

import com.project.top.domain.Board;
import com.project.top.dto.board.BoardCreateDto;
import com.project.top.dto.board.BoardDto;
import com.project.top.dto.board.BoardUpdateDto;

public interface BoardService {
    Board createBoard(BoardCreateDto boardCreateDto);
    Board updateBoard(Long boardId, Long userId, BoardUpdateDto boardUpdateDto);
    void deleteBoard(Long boardId, Long userId);
    BoardDto getBoard(Long boardId);
}
