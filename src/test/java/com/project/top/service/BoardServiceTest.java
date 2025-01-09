package com.project.top.service;

import com.project.top.domain.Board;
import com.project.top.domain.Category;
import com.project.top.dto.BoardCreateDto;
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

}