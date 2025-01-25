package com.project.top.dto.chatRoom;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomUnreadCountDto {
    private Long chatRoomId;
    private Long unreadCount;
}
