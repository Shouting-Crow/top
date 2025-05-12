package com.project.top.dto.chatMessage;

import com.project.top.domain.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long messageId;
    private Long senderId;
    private String senderName;
    private String message;
    private LocalDateTime sendAt;

    public static ChatMessageDto chatMessageDtoFromEntity(ChatMessage chatMessage) {
        ChatMessageDto chatMessageDto = new ChatMessageDto();
        chatMessageDto.setMessageId(chatMessage.getId());
        chatMessageDto.setSenderId(chatMessage.getSender().getId());
        chatMessageDto.setSenderName(chatMessage.getSender().getNickname());
        chatMessageDto.setMessage(chatMessage.getMessage());
        chatMessageDto.setSendAt(chatMessage.getSentAt());

        return chatMessageDto;
    }

}
