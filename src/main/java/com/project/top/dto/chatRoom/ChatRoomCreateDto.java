package com.project.top.dto.chatRoom;

import lombok.Data;

@Data
public class ChatRoomCreateDto {
    private Long groupId;
    private Long creatorId;
    private String chatRoomName;
}
