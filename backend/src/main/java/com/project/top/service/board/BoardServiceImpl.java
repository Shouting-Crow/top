package com.project.top.service.board;

import com.project.top.domain.Board;
import com.project.top.domain.Category;
import com.project.top.domain.User;
import com.project.top.dto.board.*;
import com.project.top.repository.BoardRepository;
import com.project.top.repository.CategoryRepository;
import com.project.top.repository.ReplyRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Transactional
    @Override
    public Board updateBoard(Long boardId, Long userId, BoardUpdateDto boardUpdateDto) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 게시글 입니다."));

        if (!board.getAuthor().getId().equals(userId)) {
            throw new SecurityException("게시글을 수정할 권한이 없습니다.");
        }

        board.setTitle(boardUpdateDto.getTitle());
        board.setContent(boardUpdateDto.getContent());

        return board;
    }

    @Override
    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!board.getAuthor().getId().equals(userId)) {
            throw new SecurityException("게시글을 삭제할 권한이 없습니다.");
        }

        boardRepository.delete(board);
    }

    @Override
    public BoardDto getBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        return BoardDto.boardDtoFromEntity(board);
    }

    @Override
    public Page<BoardListDto> getBoardList(Pageable pageable) {
        return boardRepository.findAll(pageable)
                .map(BoardListDto::fromEntity);
    }

    @Override
    public Page<BoardListDto> getMyBoardList(Long userId, Pageable pageable) {
        return boardRepository.findByAuthorId(userId, pageable)
                .map(BoardListDto::fromEntity);
    }

    @Override
    public Page<BoardListDto> searchBoards(BoardSearchDto boardSearchDto, Pageable pageable) {
        return boardRepository.searchBoards(boardSearchDto, pageable);
    }

    @Override
    @Transactional
    public void increaseView(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        board.incrementViews();
        boardRepository.save(board);
    }
}
