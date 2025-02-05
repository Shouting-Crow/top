package com.project.top.repository;

import com.project.top.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomIdOrderBySentAtAsc(Long chatRoomId);

    @Modifying
    @Query("update ChatMessage m set m.isRead = true " +
            "where m.chatRoom.id = :chatRoomId and m.isRead = false")
    void changeMessagesAsRead(@Param("chatRoomId") Long chatRoomId);

    @Query("select cm from ChatMessage cm " +
            "join fetch cm.sender " +
            "join fetch cm.chatRoom " +
            "where cm.id = :id")
    Optional<ChatMessage> findChatMessageWithSenderAndChatRoom(@Param("id") Long id);
}
