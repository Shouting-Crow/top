package com.project.top.controller;

import com.project.top.domain.Reply;
import com.project.top.dto.ReplyCreateDto;
import com.project.top.dto.ReplyUpdateDto;
import com.project.top.service.ReplyService;
import com.project.top.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/replies")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createReply(
            @RequestBody ReplyCreateDto replyCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            replyCreateDto.setAuthorId(userId);

            Reply reply = replyService.createReply(replyCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(reply);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{replyId}")
    public ResponseEntity<?> updateReply(
            @PathVariable(name = "replyId") Long replyId,
            @RequestBody ReplyUpdateDto replyUpdateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            Reply updatedReply = replyService.updateReply(replyId, userId, replyUpdateDto);
            return ResponseEntity.ok(updatedReply);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<?> deleteReply(
            @PathVariable(name = "replyId") Long replyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            replyService.deleteReply(replyId, userId);
            return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
