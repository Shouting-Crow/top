package com.project.top.service.board;

import com.project.top.domain.Board;
import com.project.top.dto.board.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BoardService {
    Board createBoard(BoardCreateDto boardCreateDto);
    Board updateBoard(Long boardId, Long userId, BoardUpdateDto boardUpdateDto);
    void deleteBoard(Long boardId, Long userId);
    BoardDto getBoard(Long boardId);
    Page<BoardListDto> getBoardList(Pageable pageable);
    Page<BoardListDto> getMyBoardList(Long userId, Pageable pageable);
    Page<BoardListDto> searchBoards(BoardSearchDto boardSearchDto, Pageable pageable);
    void increaseView(Long boardId);
    List<BoardListDto> getPopularBoardList();
}
