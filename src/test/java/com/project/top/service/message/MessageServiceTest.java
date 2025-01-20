package com.project.top.service.message;

import com.project.top.dto.message.MessageCreateDto;
import com.project.top.dto.message.MessageDto;
import com.project.top.dto.message.MessageListDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback(value = false)
@Slf4j
class MessageServiceTest {

    @Autowired
    private MessageService messageService;

    @Test
    void createMessageTest() {

        MessageCreateDto dto = new MessageCreateDto();
        dto.setContent("상위 5개 커트 메시지");
        dto.setReceiverName("공부의달인");

        MessageDto messageDto = messageService.createMessage(1L, dto);

        log.info("message content: {}", messageDto.getContent());
        log.info("message sender name: {}", messageDto.getSenderName());
        log.info("message receiver name: {}", messageDto.getReceiverName());
        log.info("message sent time: {}", messageDto.getSentAt());
    }

    @Test
    void getMessageTest() {
        List<MessageListDto> messageList1 = messageService.getMessageList(1L);
        log.info("user 1L message info : {}", messageList1.stream().toList());

        List<MessageListDto> messageList2 = messageService.getMessageList(2L);
        log.info("user 2L message info : {}", messageList2.stream().toList());

        MessageDto messageDetail = messageService.getMessageDetail(2L, 1L);
        log.info("messageDetail : {}", messageDetail.getContent());
        log.info("messageDetail : {}", messageDetail.getSentAt());
        log.info("messageDetail : {}", messageDetail.getReceiverName());
        log.info("messageDetail : {}", messageDetail.getSenderName());

        List<MessageListDto> messageListJustFive = messageService.getMessageListJustFive(2L);
        Assertions.assertEquals(5, messageListJustFive.size());

    }

    @Test
    void deleteMessageTest() {
        messageService.deleteMessage(2L, 1L);
    }
}