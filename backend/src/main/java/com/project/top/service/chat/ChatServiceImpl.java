package com.project.top.service.chat;

import com.project.top.domain.*;
import com.project.top.dto.chatMessage.ChatMessageCreateDto;
import com.project.top.dto.chatMessage.ChatMessageDto;
import com.project.top.dto.chatRoom.ChatRoomCreateDto;
import com.project.top.dto.chatRoom.ChatRoomDto;
import com.project.top.dto.chatRoom.ChatRoomListDto;
import com.project.top.dto.chatRoom.ChatRoomUnreadCountDto;
import com.project.top.repository.*;
import com.project.top.service.message.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ChatRoomReadLogRepository chatRoomReadLogRepository;

    @Override
    @Transactional
    public ChatRoomDto createChatRoom(ChatRoomCreateDto chatRoomCreateDto) {
        Group group = groupRepository.findById(chatRoomCreateDto.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다."));

        if (!group.getBasePost().getCreator().getId().equals(chatRoomCreateDto.getCreatorId())) {
            throw new SecurityException("채팅방을 생성할 권한이 없습니다.");
        }

        if (group.getChatRoom() != null) {
            throw new IllegalArgumentException("이미 해당 그룹의 채팅방이 존재합니다.");
        }

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(chatRoomCreateDto.getChatRoomName());
        chatRoom.setGroup(group);

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        for (GroupMember groupMember : group.getMembers()) {
            messageService.sendSystemMessage(groupMember.getMember().getId(),
                    "'" + group.getName() + "' 그룹의 새로운 '" + chatRoom.getName() + "' 채팅방이 생성되었습니다.");
        }

        return ChatRoomDto.chatRoomDtoFromEntity(savedChatRoom);
    }

    @Override
    public List<ChatRoomListDto> getChatRooms(Long userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByGroupMembersMemberId(userId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        List<ChatRoomListDto> chatRoomListDtos = new ArrayList<>();

        for (ChatRoom chatRoom : chatRooms) {
            List<ChatMessage> messages = chatRoom.getChatMessages();
            ChatMessage lastMessage = messages.stream()
                    .max(Comparator.comparing(ChatMessage::getSentAt))
                    .orElse(null);

            String lastContent = lastMessage != null ? lastMessage.getMessage() : "메시지가 없습니다.";
            LocalDateTime lastTime = lastMessage != null ? lastMessage.getSentAt() : null;

            LocalDateTime lastReadTime = chatRoomReadLogRepository.findByUserIdAndChatRoomId(userId, chatRoom.getId())
                    .map(ChatRoomReadLog::getLastReadTime)
                    .orElse(LocalDateTime.of(1970, 1, 1, 0, 0));

            Long unreadMessageCount = chatMessageRepository.countUnreadMessages(chatRoom.getId(), lastReadTime);

            ChatRoomListDto dto = new ChatRoomListDto(
                    chatRoom.getId(),
                    chatRoom.getName(),
                    chatRoom.getGroup().getId(),
                    chatRoom.getGroup().getName(),
                    unreadMessageCount,
                    lastContent,
                    lastTime
            );

            chatRoomListDtos.add(dto);
        }

        return chatRoomListDtos;
    }

    @Override
    @Transactional
    public ChatRoomDto getChatRoom(Long userId, Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        LocalDateTime lastReadTime = chatRoomReadLogRepository.findByUserIdAndChatRoomId(userId, chatRoomId)
                        .map(ChatRoomReadLog::getLastReadTime)
                                .orElse(LocalDateTime.of(1970, 1, 1, 0, 0));

        Long unreadMessageCount = chatMessageRepository.countUnreadMessages(chatRoomId, lastReadTime);
        log.info("getChatRoom 서비스 메서드 에서의 unreadMessageCount : {}", unreadMessageCount);

        updateLastReadTime(userId, chatRoomId);

        List<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId);

        return ChatRoomDto.chatRoomDtoFromEntities(chatRoom, messages, unreadMessageCount);
    }

    @Override
    @Transactional
    public ChatMessageDto createChatMessage(ChatMessageCreateDto chatMessageCreateDto) {
        //fetch join 사용
        ChatRoom chatRoom = chatRoomRepository.findChatRoomWithGroupAndMembers(chatMessageCreateDto.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        User sender = userRepository.findById(chatMessageCreateDto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(sender);
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setMessage(chatMessageCreateDto.getMessage());
        chatMessage.setSentAt(LocalDateTime.now());

        chatMessage = chatMessageRepository.save(chatMessage);

        //저장된 ID 기반으로 최적화된 `fetch join` 쿼리 실행
        ChatMessage savedChatMessage = chatMessageRepository.findChatMessageWithSenderAndChatRoom(chatMessage.getId())
                .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다."));

        return ChatMessageDto.chatMessageDtoFromEntity(savedChatMessage);
    }

    @Override
    public List<ChatMessageDto> getRecentChatMessages(Long chatRoomId, int limit) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);

        log.info("채팅방 {}번의 메시지 기준 날짜: {}", chatRoomId, cutoffDate);

        return chatMessageRepository.findRecentMessages(chatRoomId, limit, cutoffDate)
                .stream()
                .map(ChatMessageDto::chatMessageDtoFromEntity)
                .toList();
    }

    @Override
    public boolean isUserInChatRoom(Long chatRoomId, Long userId) {
        Integer result = chatRoomRepository.isUserInChatRoom(chatRoomId, userId);
        log.info("채팅방 {}번에 대한 사용자 {}번의 참여 여부 : {}", chatRoomId, userId, result);

        return result != null && result == 1;
    }

    @Override
    public boolean chatRoomExist(Long groupId) {
        return chatRoomRepository.existsByGroupId(groupId);
    }

    @Override
    public Long chatRoomIdByGroupId(Long groupId) {
        return chatRoomRepository.findByGroupId(groupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹이 존재하지 않습니다.")).getId();
    }

    @Override
    @Transactional
    public void sendSystemMessageToChatRoom(Long groupId, String message) {
        ChatRoom chatRoom = chatRoomRepository.findByGroupId(groupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹의 채팅방이 존재하지 않습니다."));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setMessage(message);
        chatMessage.setSentAt(LocalDateTime.now());

        User systemUser = userRepository.findByNickname("[시스템]")
                .orElseThrow(() -> new IllegalArgumentException("시스템 사용자가 존재하지 않습니다."));

        chatMessage.setSender(systemUser);
        chatMessageRepository.save(chatMessage);

        ChatMessageDto chatMessageDto = new ChatMessageDto();
        chatMessageDto.setSenderId(systemUser.getId());
        chatMessageDto.setSenderName(systemUser.getNickname());
        chatMessageDto.setMessage(message);
        chatMessageDto.setSendAt(LocalDateTime.now());

        chatMessageRepository.save(chatMessage);
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoom.getId(), chatMessageDto);
    }

    @Override
    @Transactional
    public void updateLastReadTime(Long userId, Long chatRoomId) {
        ChatRoomReadLog chatRoomReadLog = chatRoomReadLogRepository.findByUserIdAndChatRoomId(userId, chatRoomId)
                .orElse(new ChatRoomReadLog(userRepository.getReferenceById(userId), chatRoomRepository.getReferenceById(chatRoomId)));

        chatRoomReadLog.setLastReadTime(LocalDateTime.now());
        chatRoomReadLogRepository.save(chatRoomReadLog);
    }
}
