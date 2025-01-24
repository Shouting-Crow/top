package com.project.top.dto.chatMessage;

import lombok.Data;

@Data
public class ChatMessageCreateDto {
    private Long chatRoomId;
    private Long senderId;
    private String message;
}
