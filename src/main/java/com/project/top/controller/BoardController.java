package com.project.top.controller;

import com.project.top.domain.Board;
import com.project.top.domain.Reply;
import com.project.top.dto.BoardCreateDto;
import com.project.top.dto.BoardDto;
import com.project.top.dto.BoardUpdateDto;
import com.project.top.dto.ReplyDto;
import com.project.top.service.BoardService;
import com.project.top.service.ReplyService;
import com.project.top.service.UserService;
import lombok.RequiredArgsConstructor;
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
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;
    private final ReplyService replyService;

    @PostMapping
    public ResponseEntity<?> createBoard(@RequestBody BoardCreateDto boardCreateDto) {
        try {
            Board board = boardService.createBoard(boardCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("게시글이 성공적으로 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<?> updateBoard(
            @PathVariable(name = "boardId") Long boardId,
            @RequestBody BoardUpdateDto boardUpdateDto,
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

}
