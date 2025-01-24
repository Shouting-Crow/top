package com.project.top.dto.chatRoom;

import com.project.top.dto.chatMessage.ChatMessageDto;
import lombok.Data;

import java.util.List;

@Data
public class ChatRoomDto {
    private Long chatRoomId;
    private String chatRoomName;
    private Long groupId;
    private String groupName;
    private List<ChatMessageDto> messages;
}
