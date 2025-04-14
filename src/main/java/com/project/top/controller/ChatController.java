package com.project.top.controller;

import com.project.top.domain.ChatRoomReadLog;
import com.project.top.dto.chatMessage.ChatMessageCreateDto;
import com.project.top.dto.chatMessage.ChatMessageDto;
import com.project.top.dto.chatRoom.ChatRoomCreateDto;
import com.project.top.dto.chatRoom.ChatRoomDto;
import com.project.top.dto.chatRoom.ChatRoomExistDto;
import com.project.top.dto.chatRoom.ChatRoomListDto;
import com.project.top.repository.ChatMessageRepository;
import com.project.top.repository.ChatRoomReadLogRepository;
import com.project.top.service.chat.ChatService;
import com.project.top.service.group.GroupService;
import com.project.top.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;
    private final GroupService groupService;
    private final ChatRoomReadLogRepository chatRoomReadLogRepository;
    private final ChatMessageRepository chatMessageRepository;

    @PostMapping("/room")
    public ResponseEntity<?> createChatRoom(@Valid @RequestBody ChatRoomCreateDto chatRoomCreateDto,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            if (!userId.equals(chatRoomCreateDto.getCreatorId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            ChatRoomDto chatRoomDto = chatService.createChatRoom(chatRoomCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(chatRoomDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getChatRooms(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            List<ChatRoomListDto> chatRooms = chatService.getChatRooms(userId);

            log.info("채팅방 목록 : {}", chatRooms);
            return ResponseEntity.status(HttpStatus.OK).body(chatRooms);
        } catch (Exception e) {
            log.error("채팅방 목록 조회 실패", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/rooms/{chatRoomId}")
    public ResponseEntity<?> getChatRoom(@PathVariable(name = "chatRoomId") Long chatRoomId,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

            ChatRoomDto chatRoom = chatService.getChatRoom(userId, chatRoomId);

            groupService.getGroup(chatRoom.getGroupId(), userId);
            return ResponseEntity.status(HttpStatus.OK).body(chatRoom);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<?> getChatRoomMessages(
            @PathVariable(name = "roomId") Long roomId,
            @RequestParam(defaultValue = "50") int limit,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());

        log.info("채팅방 {}번의 최근 {}개 메시지 조회", roomId, limit);

        if (!chatService.isUserInChatRoom(roomId, userId)) {
            log.warn("접근이 거부되었습니다. 해당 사용자는 그룹의 일원이 아닙니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<ChatMessageDto> recentChatMessages = chatService.getRecentChatMessages(roomId, limit);

        return ResponseEntity.ok(recentChatMessages);
    }

    @GetMapping("/rooms/exist/{groupId}")
    public ResponseEntity<?> checkChatRoomExists(@PathVariable(name = "groupId") Long groupId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        try {
            userService.getUserIdFromLoginId(userDetails.getUsername());

            boolean exists = chatService.chatRoomExist(groupId);
            Long chatRoomId = exists ? chatService.chatRoomIdByGroupId(groupId) : null;

            ChatRoomExistDto chatRoomExistDto = new ChatRoomExistDto(exists, chatRoomId);

            return ResponseEntity.ok(chatRoomExistDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/rooms/{chatRoomId}/unread-count")
    public ResponseEntity<?> getUnreadCount(@PathVariable(name = "chatRoomId") Long chatRoomId,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = userService.getUserIdFromLoginId(userDetails.getUsername());
            LocalDateTime lastReadTime = chatRoomReadLogRepository.findByUserIdAndChatRoomId(userId, chatRoomId)
                    .map(ChatRoomReadLog::getLastReadTime)
                    .orElse(LocalDateTime.of(1970, 1, 1, 0, 0));

            Long unreadCount = chatMessageRepository.countUnreadMessages(chatRoomId, lastReadTime);

            return ResponseEntity.ok(unreadCount);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
