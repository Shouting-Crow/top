package com.project.top.controller;

import com.project.top.dto.message.MessageCreateDto;
import com.project.top.dto.message.MessageDto;
import com.project.top.dto.message.MessageListDto;
import com.project.top.service.message.MessageService;
import com.project.top.service.user.UserService;
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

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createMessage(
            @RequestBody MessageCreateDto messageCreateDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long senderId = userService.getUserIdFromLoginId(userDetails.getUsername());
            MessageDto messageDto = messageService.createMessage(senderId, messageCreateDto);

            return ResponseEntity.status(HttpStatus.CREATED).body(messageDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable(name = "messageId") Long messageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            messageService.deleteMessage(userId, messageId);

            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<?> getMessage(
            @PathVariable(name = "messageId") Long messageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            MessageDto messageDto = messageService.getMessageDetail(userId, messageId);

            return ResponseEntity.ok(messageDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMessageList(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "sentAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            Page<MessageListDto> messageList = messageService.getMessageList(userId, pageable);

            return ResponseEntity.ok(messageList);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentMessages(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            List<MessageListDto> recentMessages = messageService.getMessageListJustFive(userId);

            return ResponseEntity.ok(recentMessages);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadMessagesCount(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            Integer count = messageService.countUnread(userId);

            return ResponseEntity.ok(count);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
