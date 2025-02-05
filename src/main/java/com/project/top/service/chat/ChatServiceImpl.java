package com.project.top.service.chat;

import com.project.top.domain.*;
import com.project.top.dto.chatMessage.ChatMessageCreateDto;
import com.project.top.dto.chatMessage.ChatMessageDto;
import com.project.top.dto.chatRoom.ChatRoomCreateDto;
import com.project.top.dto.chatRoom.ChatRoomDto;
import com.project.top.dto.chatRoom.ChatRoomListDto;
import com.project.top.dto.chatRoom.ChatRoomUnreadCountDto;
import com.project.top.repository.*;
import lombok.RequiredArgsConstructor;
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
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final ChatMessageReadStatusRepository chatMessageReadStatusRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

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
        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageCreateDto.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        User sender = userRepository.findById(chatMessageCreateDto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(sender);
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setMessage(chatMessageCreateDto.getMessage());
        chatMessage.setSentAt(LocalDateTime.now());

        ChatMessage savedChatMessage = chatMessageRepository.save(chatMessage);

        List<GroupMember> groupMembers = chatRoom.getGroup().getMembers();
        List<ChatMessageReadStatus> readStatuses = new ArrayList<>();

        groupMembers.forEach(groupMember -> {
            if(groupMember.getMember() != null){
                ChatMessageReadStatus readStatus = new ChatMessageReadStatus();
                readStatus.setMessage(savedChatMessage);
                readStatus.setUser(groupMember.getMember());
                readStatuses.add(readStatus);
            }
        });
        chatMessageReadStatusRepository.saveAll(readStatuses); //배치 저장 이용

        simpMessagingTemplate.convertAndSend("/topic/chat/" + chatRoom.getId(),
                ChatMessageDto.chatMessageDtoFromEntity(savedChatMessage));

        return ChatMessageDto.chatMessageDtoFromEntity(savedChatMessage);
    }

    @Override
    public int countUnreadMessages(Long userId) {
        return chatMessageReadStatusRepository.countByUserIdAndIsReadFalse(userId);
    }
}
