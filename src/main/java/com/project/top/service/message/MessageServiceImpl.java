package com.project.top.service.message;

import com.project.top.domain.Message;
import com.project.top.domain.User;
import com.project.top.dto.message.MessageCreateDto;
import com.project.top.dto.message.MessageDto;
import com.project.top.dto.message.MessageListDto;
import com.project.top.repository.MessageRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.web.client.HttpMessageConvertersRestClientCustomizer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService{

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public MessageDto createMessage(Long senderId, MessageCreateDto messageCreateDto) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("로그인이 필요한 기능입니다."));

        User receiver = userRepository.findByNickname(messageCreateDto.getReceiverName())
                .orElseThrow(() -> new IllegalArgumentException("수신자를 찾을 수 없습니다."));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(messageCreateDto.getContent());
        message.setRead(false);
        message.setSentAt(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        return MessageDto.messageDtoFromEntity(savedMessage);
    }

    @Override
    @Transactional
    public void deleteMessage(Long userId, Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("쪽지를 찾을 수 없습니다."));

        if (!message.getReceiver().getId().equals(userId)) {
            throw new SecurityException("쪽지를 삭제할 권한이 없습니다.");
        }

        messageRepository.delete(message);
    }

    @Override
    public Page<MessageListDto> getMessageList(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Page<Message> receivedMessages = messageRepository.findByReceiverOrderBySentAtDesc(user, pageable);

        return receivedMessages.map(MessageListDto::convertMessageListDtoFromEntity);
    }

    @Override
    public List<MessageListDto> getMessageListJustFive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<Message> recentMessages = messageRepository.findTop5ByReceiverOrderBySentAtDesc(user);

        return getMessageListDto(recentMessages);
    }



    @Override
    @Transactional
    public MessageDto getMessageDetail(Long userId, Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("쪽지를 찾을 수 없습니다."));

        if (!message.getReceiver().getId().equals(userId)) {
            throw new SecurityException("쪽지를 확인할 권한이 없습니다.");
        }

        if (!message.isRead()) {
            message.setRead(true);
            messageRepository.save(message);
        }

        return MessageDto.messageDtoFromEntity(message);
    }

    @Override
    public Integer countUnread(Long userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }

    private List<MessageListDto> getMessageListDto(List<Message> recentMessages) {
        return recentMessages.stream()
                .map(message -> {
                    MessageListDto dto = new MessageListDto();
                    dto.setMessageId(message.getId());
                    dto.setSenderId(message.getSender().getId());
                    dto.setSenderName(message.getSender().getNickname());
                    dto.setContent(message.getContent().length() > 10 ?
                            message.getContent().substring(0, 10) + "..." : message.getContent());
                    dto.setRead(message.isRead());
                    dto.setSentAt(message.getSentAt());
                    return dto;
                })
                .toList();
    }

    @Override
    @Transactional
    public MessageDto sendSystemMessage(Long receiverId, String content) {
        User systemUser = userRepository.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException("시스템 사용자를 찾을 수 없습니다."));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("수신자를 찾을 수 없습니다."));

        Message message = new Message();
        message.setSender(systemUser);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setRead(false);
        message.setSentAt(LocalDateTime.now());

        Message savedSystemMessage = messageRepository.save(message);

        return MessageDto.messageDtoFromEntity(savedSystemMessage);
    }
}
