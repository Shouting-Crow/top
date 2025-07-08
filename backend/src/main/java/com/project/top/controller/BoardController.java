package com.project.top.controller;

import com.project.top.domain.Board;
import com.project.top.dto.board.*;
import com.project.top.dto.reply.ReplyDto;
import com.project.top.service.board.BoardService;
import com.project.top.service.reply.ReplyService;
import com.project.top.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;
    private final ReplyService replyService;

    @PostMapping
    public ResponseEntity<?> createBoard(
            @Valid @RequestBody BoardCreateDto boardCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            userService.getUserIdFromLoginId(userDetails.getUsername());

            boardService.createBoard(boardCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("게시글이 성공적으로 등록되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<?> updateBoard(
            @PathVariable(name = "boardId") Long boardId,
            @Valid @RequestBody BoardUpdateDto boardUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            boardService.updateBoard(boardId, userId, boardUpdateDto);
            return ResponseEntity.ok("게시글이 성공적으로 수정되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteBoard(
            @PathVariable(name = "boardId") Long boardId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            boardService.deleteBoard(boardId, userId);
            return ResponseEntity.ok("게시글이 성공적으로 삭제되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<?> getBoardWithReplies(
            @PathVariable(name = "boardId") Long boardId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        try {
            BoardDto board = boardService.getBoard(boardId);

            Page<ReplyDto> replies = replyService.getRepliesByBoardId(boardId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("board", board);
            response.put("replies", replies);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getBoardList(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<BoardListDto> boardList = boardService.getBoardList(pageable);

        return ResponseEntity.ok(boardList);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBoards(
            @RequestParam String searchType,
            @RequestParam String keyword,
            @RequestParam String category,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        BoardSearchDto boardSearchDto = new BoardSearchDto();
        boardSearchDto.setSearchType(searchType);
        boardSearchDto.setKeyword(keyword);
        boardSearchDto.setBoardType(category);

        Page<BoardListDto> result = boardService.searchBoards(boardSearchDto, pageable);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{boardId}/view")
    public ResponseEntity<?> increaseView(@PathVariable Long boardId) {
        boardService.increaseView(boardId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBoardList(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC, page = 0) Pageable pageable) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            Page<BoardListDto> myBoardList = boardService.getMyBoardList(userId, pageable);
            return ResponseEntity.ok(myBoardList);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    @GetMapping("/popular")
    public ResponseEntity<?> getPopularBoardList() {
        List<BoardListDto> popularBoards = boardService.getPopularBoardList();

        return ResponseEntity.ok(popularBoards);
    }

}
