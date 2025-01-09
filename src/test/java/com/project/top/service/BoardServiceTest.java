package com.project.top.service;

import com.project.top.domain.Board;
import com.project.top.domain.Category;
import com.project.top.dto.BoardCreateDto;
import com.project.top.dto.BoardUpdateDto;
import com.project.top.dto.LoginDto;
import com.project.top.dto.LoginResponseDto;
import com.project.top.repository.BoardRepository;
import com.project.top.repository.CategoryRepository;
import com.project.top.repository.ReplyRepository;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;

import static org.junit.jupiter.api.Assertions.*;

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

        Category category = new Category();
        category.setName("일반글");
        category.setDescription("일반적인 글 카테고리");
        categoryRepository.save(category);

        BoardCreateDto boardCreateDto = new BoardCreateDto();
        boardCreateDto.setTitle("새로운 게시글 제목");
        boardCreateDto.setContent("새로운 게시글 내용");
        boardCreateDto.setAuthorId(7L);
        boardCreateDto.setCategoryId(category.getId());

        Board board = boardService.createBoard(boardCreateDto);

        Assertions.assertThat(board.getTitle()).isEqualTo("새로운 게시글 제목");
        Assertions.assertThat(board.getContent()).isEqualTo("새로운 게시글 내용");
        Assertions.assertThat(board.getAuthor().getId()).isEqualTo(7L);
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