package com.project.top.dto.chatMessage;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageDto {
    private Long messageId;
    private Long senderId;
    private String senderName;
    private String message;
    private LocalDateTime sendAt;
}
