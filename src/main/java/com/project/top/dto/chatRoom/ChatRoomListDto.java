package com.project.top.dto.chatRoom;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatRoomListDto {
    private Long chatRoomId;
    private String chatRoomName;
    private Long groupId;
    private String groupName;
    private Long unreadMessageCount;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;
}
