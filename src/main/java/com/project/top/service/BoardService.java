package com.project.top.service;

import com.project.top.domain.Board;
import com.project.top.dto.BoardCreateDto;

public interface BoardService {
    Board createBoard(BoardCreateDto boardCreateDto);
}
