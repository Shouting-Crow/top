package com.project.top.service;

import com.project.top.domain.Board;
import com.project.top.domain.Category;
import com.project.top.domain.User;
import com.project.top.dto.BoardCreateDto;
import com.project.top.repository.BoardRepository;
import com.project.top.repository.CategoryRepository;
import com.project.top.repository.ReplyRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService{

    private final BoardRepository boardRepository;
    private final ReplyRepository replyRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public Board createBoard(BoardCreateDto boardCreateDto) {
        User author = userRepository.findById(boardCreateDto.getAuthorId())
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        Category category = categoryRepository.findById(boardCreateDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        Board board = new Board();
        board.setTitle(boardCreateDto.getTitle());
        board.setContent(boardCreateDto.getContent());
        board.setAuthor(author);
        board.setCategory(category);
        board.setViews(0);
        board.setReplyCount(0);

        return boardRepository.save(board);
    }
}
