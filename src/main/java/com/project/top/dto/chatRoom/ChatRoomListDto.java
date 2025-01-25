package com.project.top.dto.chatRoom;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatRoomListDto {
    private Long chatRoomId;
    private String chatRoomName;
    private Long groupId;
    private String groupName;
    private boolean hasUnreadMessages;
    private Long unreadMessageCount;
}
