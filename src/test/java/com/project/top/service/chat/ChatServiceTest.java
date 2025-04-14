package com.project.top.service.chat;

import com.project.top.dto.chatMessage.ChatMessageCreateDto;
import com.project.top.dto.chatRoom.ChatRoomCreateDto;
import com.project.top.dto.chatRoom.ChatRoomDto;
import com.project.top.dto.chatRoom.ChatRoomListDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
@Transactional
@Rollback(false)
class ChatServiceTest {

    @Autowired
    private ChatService chatService;

    @Test
    void createChatRoomTest() {
        ChatRoomCreateDto chatRoomCreateDto = new ChatRoomCreateDto();
        chatRoomCreateDto.setCreatorId(1L);
        chatRoomCreateDto.setGroupId(3L);
        chatRoomCreateDto.setChatRoomName("테스트 채팅방");

        chatService.createChatRoom(chatRoomCreateDto);
    }

    @Test
    void createMessageTest() {
        ChatMessageCreateDto chatMessageCreateDto = new ChatMessageCreateDto();
        chatMessageCreateDto.setSenderId(1L);
        chatMessageCreateDto.setMessage("안녕하세요");
        chatMessageCreateDto.setChatRoomId(1L);

        chatService.createChatMessage(chatMessageCreateDto);

        ChatMessageCreateDto chatMessageCreateDto2 = new ChatMessageCreateDto();
        chatMessageCreateDto2.setSenderId(2L);
        chatMessageCreateDto2.setMessage("네 안녕하세요");
        chatMessageCreateDto2.setChatRoomId(1L);

        chatService.createChatMessage(chatMessageCreateDto2);
    }

//    @Test
//    void getChatRoomTest() {
//        List<ChatRoomListDto> chatRooms = chatService.getChatRooms(1L);
//        log.info("{}", chatRooms.get(0).getChatRoomName());
//
//        ChatRoomDto chatRoom = chatService.getChatRoom(1L);
//        log.info("{}", chatRoom.getChatRoomId());
//        log.info("{}", chatRoom.getChatRoomName());
//        log.info("{}", chatRoom.getMessages().size());
//        log.info("{}", chatRoom.getGroupId());
//        log.info("{}", chatRoom.getGroupName());
//
//    }

//    @Test
//    void countUnreadMessageTest() {
//        log.info("{}", chatService.countUnreadMessages(1L));
//        log.info("{}", chatService.countUnreadMessages(2L));
//    }
}