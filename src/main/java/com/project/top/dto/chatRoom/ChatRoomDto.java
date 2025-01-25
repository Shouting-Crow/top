package com.project.top.dto.chatRoom;

import com.project.top.domain.ChatMessage;
import com.project.top.domain.ChatRoom;
import com.project.top.dto.chatMessage.ChatMessageDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ChatRoomDto {
    private Long chatRoomId;
    private String chatRoomName;
    private Long groupId;
    private String groupName;
    private List<ChatMessageDto> messages;

    public static ChatRoomDto chatRoomDtoFromEntity(ChatRoom chatRoom) {
        ChatRoomDto chatRoomDto = new ChatRoomDto();
        chatRoomDto.setChatRoomId(chatRoom.getId());
        chatRoomDto.setChatRoomName(chatRoom.getName());
        chatRoomDto.setGroupId(chatRoom.getGroup().getId());
        chatRoomDto.setGroupName(chatRoom.getGroup().getName());

        return chatRoomDto;
    }

    public static ChatRoomDto chatRoomDtoFromEntities(ChatRoom chatRoom, List<ChatMessage> messages) {
        List<ChatMessageDto> messageDtos = messages.stream()
                .map(message -> new ChatMessageDto(
                        message.getId(),
                        message.getSender().getId(),
                        message.getSender().getNickname(),
                        message.getMessage(),
                        message.getSentAt()
                )).toList();

        ChatRoomDto chatRoomDto = new ChatRoomDto();
        chatRoomDto.setChatRoomId(chatRoom.getId());
        chatRoomDto.setChatRoomName(chatRoom.getName());
        chatRoomDto.setGroupId(chatRoom.getGroup().getId());
        chatRoomDto.setGroupName(chatRoom.getGroup().getName());
        chatRoomDto.setMessages(messageDtos);

        return chatRoomDto;
    }
}
