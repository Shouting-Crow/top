package com.project.top.service.chat;

import com.project.top.dto.chatMessage.ChatMessageCreateDto;
import com.project.top.dto.chatMessage.ChatMessageDto;
import com.project.top.dto.chatRoom.ChatRoomCreateDto;
import com.project.top.dto.chatRoom.ChatRoomDto;
import com.project.top.dto.chatRoom.ChatRoomListDto;

import java.util.List;

public interface ChatService {
    ChatRoomDto createChatRoom(ChatRoomCreateDto chatRoomCreateDto);
    List<ChatRoomListDto> getChatRooms(Long userId);
    ChatRoomDto getChatRoom(Long chatRoomId);
    ChatMessageDto createChatMessage(ChatMessageCreateDto chatMessageCreateDto);
    int countUnreadMessages(Long userId);
}
