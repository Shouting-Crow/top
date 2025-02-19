package com.project.top.service.board;

import com.project.top.domain.Board;
import com.project.top.dto.board.BoardCreateDto;
import com.project.top.dto.board.BoardDto;
import com.project.top.dto.board.BoardListDto;
import com.project.top.dto.board.BoardUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardService {
    Board createBoard(BoardCreateDto boardCreateDto);
    Board updateBoard(Long boardId, Long userId, BoardUpdateDto boardUpdateDto);
    void deleteBoard(Long boardId, Long userId);
    BoardDto getBoard(Long boardId);
    Page<BoardListDto> getBoardList(Pageable pageable);
}
