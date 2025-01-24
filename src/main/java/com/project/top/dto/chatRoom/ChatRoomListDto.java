package com.project.top.dto.chatRoom;

import lombok.Data;

@Data
public class ChatRoomListDto {
    private Long chatRoomId;
    private String chatRoomName;
    private Long groupId;
    private String groupName;
    private boolean newMessages;
}
