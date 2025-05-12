package com.project.top.dto.chatRoom;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatRoomExistDto {
    private boolean exists;
    private Long chatRoomId;
}
