package com.project.top.service.message;

import com.project.top.dto.message.MessageCreateDto;
import com.project.top.dto.message.MessageDto;
import com.project.top.dto.message.MessageListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageService {
    MessageDto createMessage(Long senderId, MessageCreateDto messageCreateDto);
    void deleteMessage(Long userId, Long messageId);
    Page<MessageListDto> getMessageList(Long userId, Pageable pageable);
    List<MessageListDto> getMessageListJustFive(Long userId);
    MessageDto getMessageDetail(Long userId, Long messageId);
    Integer countUnread(Long userId);
    MessageDto sendSystemMessage(Long receiverId, String content);
}
