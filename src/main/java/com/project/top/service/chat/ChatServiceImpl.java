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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final ChatMessageReadStatusRepository chatMessageReadStatusRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

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

        Map<Long, Long> unreadCountMap = chatMessageReadStatusRepository.findUnreadMessageCountsByUserId(userId)
                .stream()
                .collect(Collectors.toMap(ChatRoomUnreadCountDto::getChatRoomId, ChatRoomUnreadCountDto::getUnreadCount));

        return chatRooms.stream()
                .map(chatRoom -> {
                    Long unreadMessageCount = unreadCountMap.getOrDefault(chatRoom.getId(), 0L);

                    return new ChatRoomListDto(
                            chatRoom.getId(),
                            chatRoom.getName(),
                            chatRoom.getGroup().getId(),
                            chatRoom.getGroup().getName(),
                            unreadMessageCount > 0,
                            unreadMessageCount
                    );
                })
                .toList();
    }

    @Override
    @Transactional
    public ChatRoomDto getChatRoom(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        List<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId);

        chatMessageRepository.changeMessagesAsRead(chatRoomId);

        return ChatRoomDto.chatRoomDtoFromEntities(chatRoom, messages);
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

        //읽음 상태 저장을 위해 그룹 멤버 ID 리스트 가져오기
        List<Long> userIds = chatRoom.getGroup().getMembers().stream()
                .map(groupMember -> groupMember.getMember().getId())
                .toList();

        //읽음 상태 한 번의 배치 저장
        chatMessageReadStatusRepository.saveAllReadStatus(false, savedChatMessage, userIds);

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
    public int countUnreadMessages(Long userId) {
        return chatMessageReadStatusRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public boolean isUserInChatRoom(Long chatRoomId, Long userId) {
        Integer result = chatRoomRepository.isUserInChatRoom(chatRoomId, userId);
        log.info("채팅방 {}번에 대한 사용자 {}번의 참여 여부 : {}", chatRoomId, userId, result);

        return result != null && result == 1;
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
}
