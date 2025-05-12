package com.project.top.controller;

import com.project.top.dto.chatMessage.ChatMessageCreateDto;
import com.project.top.dto.chatMessage.ChatMessageDto;
import com.project.top.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageCreateDto chatMessageCreateDto,
                            @Header("simpSessionAttributes") Map<String, Object> sessionAttributes) {
        Long userId = (Long) sessionAttributes.get("userId");

        if (!chatService.isUserInChatRoom(chatMessageCreateDto.getChatRoomId(), userId)) {
            throw new AccessDeniedException("이 채팅방에 접근 권한이 없습니다");
        }

        if (userId == null) {
            throw new IllegalArgumentException("userId가 세션에 존재하지 않습니다.");
        }

        chatMessageCreateDto.setSenderId(userId);

        ChatMessageDto chatMessage = chatService.createChatMessage(chatMessageCreateDto);
        log.info("대화 사용자 이름 : {}", chatMessage.getSenderName());

        messagingTemplate.convertAndSend("/topic/chat/" + chatMessageCreateDto.getChatRoomId(), chatMessage);
    }

}
