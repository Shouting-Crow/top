package com.project.top.repository;

import com.project.top.dto.board.BoardListDto;
import com.project.top.dto.board.BoardSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardRepositoryCustom {
    Page<BoardListDto> searchBoards(BoardSearchDto boardSearchDto, Pageable pageable);
}
