package com.project.top.service;

import com.project.top.domain.Board;
import com.project.top.dto.board.BoardCreateDto;
import com.project.top.dto.board.BoardUpdateDto;
import com.project.top.repository.BoardRepository;
import com.project.top.repository.CategoryRepository;
import com.project.top.repository.ReplyRepository;
import com.project.top.service.board.BoardService;
import com.project.top.service.login.LoginService;
import com.project.top.service.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;

@SpringBootTest
@Slf4j
@Rollback(false)
class BoardServiceTest {

    @Autowired
    private BoardService boardService;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private LoginService loginService;

    @Test
    void boardCreateTest() {

        BoardCreateDto boardCreateDto = new BoardCreateDto();
        boardCreateDto.setTitle("새로운 게시글 제목");
        boardCreateDto.setContent("새로운 게시글 내용");
        boardCreateDto.setAuthorId(1L);
        boardCreateDto.setCategoryId(2L);

        Board board = boardService.createBoard(boardCreateDto);

        Assertions.assertThat(board.getTitle()).isEqualTo("새로운 게시글 제목");
        Assertions.assertThat(board.getContent()).isEqualTo("새로운 게시글 내용");
        Assertions.assertThat(board.getAuthor().getId()).isEqualTo(1L);
        Assertions.assertThat(board.getViews()).isEqualTo(0);
    }

    @Test
    void boardUpdateTest() {

        BoardUpdateDto boardUpdateDto = new BoardUpdateDto();
        boardUpdateDto.setTitle("수정된 게시글 제목");
        boardUpdateDto.setContent("수정된 게시글 내용");

        Board updatedBoard = boardService.updateBoard(1L, 7L, boardUpdateDto);

        Assertions.assertThat(updatedBoard.getTitle()).isEqualTo("수정된 게시글 제목");
        Assertions.assertThat(updatedBoard.getContent()).isEqualTo("수정된 게시글 내용");
    }

    @Test
    void boardDeleteTest() {
        boardService.deleteBoard(1L, 7L);
    }

}