package com.project.top.dto.message;

import com.project.top.domain.Message;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDto {
    private Long messageId;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String content;
    private boolean isRead;
    private LocalDateTime sentAt;

    public static MessageDto messageDtoFromEntity(Message message) {
        MessageDto messageDto = new MessageDto();
        messageDto.setMessageId(message.getId());
        messageDto.setSenderId(message.getSender().getId());
        messageDto.setReceiverId(message.getReceiver().getId());
        messageDto.setContent(message.getContent());
        messageDto.setRead(message.isRead());
        messageDto.setSentAt(message.getSentAt());
        messageDto.setSenderName(message.getSender().getNickname());
        messageDto.setReceiverName(message.getReceiver().getNickname());

        return messageDto;
    }
}
