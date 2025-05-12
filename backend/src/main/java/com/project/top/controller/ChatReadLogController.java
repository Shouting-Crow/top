package com.project.top.controller;

import com.project.top.service.chat.ChatService;
import com.project.top.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatReadLogController {

    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/read-log")
    public ResponseEntity<?> updateChatReadTime(@AuthenticationPrincipal UserDetails userDetails,
                                                @RequestBody Map<String, Long> request) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            Long chatRoomId = request.get("chatRoomId");

            chatService.updateLastReadTime(userId, chatRoomId);

            return ResponseEntity.ok("마지막으로 읽은 채팅 시각이 기록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("마지막으로 읽은 채팅 시각 기록 중 오류 발생 : " + e.getMessage());
        }
    }
}
