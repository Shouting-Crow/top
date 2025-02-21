package com.project.top.dto.message;

import com.project.top.domain.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageListDto {
    private Long messageId;
    private Long senderId;
    private String senderName;
    private String content;
    private boolean isRead;
    private LocalDateTime sentAt;

    public static MessageListDto convertMessageListDtoFromEntity(Message message) {
        return new MessageListDto(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getNickname(),
                message.getContent(),
                message.isRead(),
                message.getSentAt()
        );
    }
}
