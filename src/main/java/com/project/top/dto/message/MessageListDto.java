package com.project.top.dto.message;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageListDto {
    private Long messageId;
    private Long senderId;
    private String senderName;
    private String content;
    private boolean isRead;
    private LocalDateTime sentAt;
}
