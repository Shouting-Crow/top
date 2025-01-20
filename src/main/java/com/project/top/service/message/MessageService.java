package com.project.top.service.message;

import com.project.top.dto.message.MessageCreateDto;
import com.project.top.dto.message.MessageDto;
import com.project.top.dto.message.MessageListDto;

import java.util.List;

public interface MessageService {
    MessageDto createMessage(Long senderId, MessageCreateDto messageCreateDto);
    void deleteMessage(Long userId, Long messageId);
    List<MessageListDto> getMessageList(Long userId);
    List<MessageListDto> getMessageListJustFive(Long userId);
    MessageDto getMessageDetail(Long userId, Long messageId);
    Integer countUnread(Long userId);
}
