package com.project.top.dto.chatMessage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageCreateDto {
    private Long chatRoomId;
    private Long senderId;
    private String message;
}
